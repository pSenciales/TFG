import json
from flask import Blueprint,request, jsonify
from mongoengine import DoesNotExist

from api.model import Report, User, File
from api.utils import *

report_bp = Blueprint('report_routes', __name__, url_prefix='/reports')


@report_bp.route('/', methods=['GET'])
@report_bp.route('', methods=['GET'])
def get_reports():
    cursor = request.args.get('cursor', default=0, type=int)
    limit = request.args.get('limit', default=6, type=int)

    reports = Report.objects.skip(cursor).limit(limit)

    reports_data = reports.to_json()

    next_cursor = cursor + len(reports_data) if len(reports_data) == limit else None

    return jsonify({
        "reports": reports_data,
        "nextCursor": next_cursor
    }), 200


@report_bp.route('/', methods=['POST'])
@report_bp.route('', methods=['POST'])
def create_report():
    data = request.get_json()

    # Verifica campos obligatorios
    if missing := missing_fields(["content", "source", "is_hate", "notification_email", "pdf_link"], data):
        return missing

    provider = data.get('provider')
    user_obj = None
    if provider:
        user_obj = User.objects(email=data['notification_email'], provider=provider).first()
    user_id = str(user_obj.id) if user_obj else None

    # Crea el objeto File para el PDF usando la URL proporcionada
    pdf_file = File(url=data['pdf_link'])

    # Crea el reporte
    is_hate_value = data.get('is_hate')
    # Si es string, conviértelo
    if isinstance(is_hate_value, str):
        is_hate_value = is_hate_value.lower() == 'true'
    # Si ya es booleano, se queda igual

    report = Report(
        content=data.get('content'),
        source=data.get('source'),
        context=data.get('context', ""),
        is_hate=is_hate_value,
        user_id=user_id,
        notification_email=data['notification_email'],
        images=data.get('images', []),
        pdf=[pdf_file],
        resolutions=data.get('resolutions', [])
    )
    report.save()

    return success("Report created", 201)




@report_bp.route('/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    report = Report.objects(id=report_id).first()

    if not_found := element_not_found(report, "Report not found"):
        return not_found

    report.delete()
    return success("Report deleted", 200)


@report_bp.route('/<report_id>', methods=['PUT'])
def update_report(report_id):
    report = Report.objects(id=report_id).first()

    if not_found := element_not_found(report, "Report not found"):
        return not_found

    data = request.get_json()

    if 'resolutions' in data:
        report.resolutions.extend(data['resolutions'])

    if 'state' in data:
        report.state = data['state']

    report.save()
    return success("Report updated", 200)




@report_bp.route('/user', methods=['GET'])
def get_user_reports():
    # Extraer email y provider desde la query string
    email = request.args.get('email')
    provider = request.args.get('provider')

    if not email or not provider:
        return jsonify({"error": "Missing email or provider"}), 400

    # Buscar el usuario basado en el email y provider
    try:
        user = User.objects.get(email=email, provider="credentials")
    except DoesNotExist:
        return jsonify({"error": "User not valid"}), 404

    # Parámetros de paginación: cursor (offset) y limit
    cursor = request.args.get('cursor', default=0, type=int)
    limit = 9

    # Filtrar reportes del usuario, ordenados descendente por fecha de creación,
    # y aplicar skip y limit
    reports_query = Report.objects(user_id=str(user.id)).order_by('-created_at')
    reports = reports_query.skip(cursor).limit(limit)

    # Convertir los reportes a un objeto Python (lista) para poder calcular el largo
    reports_list = json.loads(reports.to_json())

    # Calcular el siguiente cursor: si se han obtenido "limit" elementos,
    # se asume que puede haber más; en caso contrario, no hay siguiente página
    next_cursor = cursor + len(reports_list) if len(reports_list) == limit else None

    return jsonify({
        "reports": reports_list,
        "nextCursor": next_cursor
    }), 200

@report_bp.route('/admin', methods=['GET'])
def get_admin_reports():
    # ——————————— Autorización idéntica a la tuya ———————————
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Missing email"}), 400

    try:
        user = User.objects.get(email=email, provider="credentials")
    except DoesNotExist:
        return jsonify({"error": "User not valid"}), 404

    if not user.is_admin:
        return jsonify({"error": "User not valid"}), 404

    # ——————————— Parámetros de paginación ———————————
    cursor = request.args.get('cursor', default=0, type=int)
    limit  = request.args.get('limit', default=9,  type=int)

    # ——————————— Parámetros de filtrado ———————————
    # Orden (sortBy puede ser: date_desc, date_asc, content_asc, content_desc)
    sort_by     = request.args.get('sortBy', default='date_desc')
    # Búsqueda por email de usuario (substring, case‑insensitive)
    search_email = request.args.get('searchEmail', default=None)
    # Hate filters: include both por defecto, se pueden pasar como 'true'/'false'
    include_hate     = request.args.get('includeHate',  'true') == 'true'
    include_not_hate = request.args.get('includeNotHate','true') == 'true'
    # Status: lista de estados a mostrar, ejemplo ?status=processing&status=accepted
    statuses = request.args.getlist('status')

    # ——————————— Construcción del query ———————————
    q = Report.objects(notification_email__ne=email)

    # Filtrado por substring de email
    if search_email:
        q = q.filter(notification_email__icontains=search_email)

    # Filtrado por is_hate (solo si uno de los dos flags es falso)
    if include_hate != include_not_hate:
        q = q.filter(is_hate=include_hate)

    # Filtrado por estado
    if statuses:
        q = q.filter(state__in=statuses)

    # Ordenación
    if sort_by == 'date_desc':
        q = q.order_by('-created_at')
    elif sort_by == 'date_asc':
        q = q.order_by('created_at')
    elif sort_by == 'content_asc':
        q = q.order_by('content')
    elif sort_by == 'content_desc':
        q = q.order_by('-content')
    else:
        # fallback
        q = q.order_by('-created_at')

    # Paginación con skip/limit
    page = q.skip(cursor).limit(limit)

    # Convertir a lista de dicts
    reports_list = json.loads(page.to_json())

    # Calcular nextCursor
    next_cursor = cursor + len(reports_list) if len(reports_list) == limit else None

    return jsonify({
        "reports": reports_list,
        "nextCursor": next_cursor
    }), 200


import json
from flask import Blueprint,request, jsonify
from mongoengine import DoesNotExist
from datetime import datetime, UTC, timedelta
import pandas as pd
from pytz import UTC

from api.model import Report, User, File, Resolution
from api.utils import *

report_bp = Blueprint('report_routes', __name__, url_prefix='/reports')


@report_bp.route('/', methods=['GET'])
@report_bp.route('', methods=['GET'])
def get_reports():
    cursor = request.args.get('cursor', default=0, type=int)
    limit = request.args.get('limit', default=9, type=int)

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
        user_obj = User.objects(email=data['notification_email'], provider=provider, is_active=True).first()
    user_id = str(user_obj.id) if user_obj else None
    image_url = data.get('image_url')
    if image_url:
        image_file = File(url=image_url)

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
        pdf=[pdf_file],
        resolutions=data.get('resolutions', [])
    )

    image_url = data.get('image_url')
    if image_url:
        image_file = File(url=image_url)
        report.images.append(image_file)
        
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

    resolution = data.get('resolution')

    if resolution:

        if missing := missing_fields(["action", "user_id"], resolution):
            return missing

        action = resolution['action']
        reason = resolution.get('reason', "No reason was given")
        user_id = resolution['user_id']

        new_resolution = Resolution(action=action, reason=reason, user_id=user_id)

        report.resolutions.append(new_resolution)

    if 'state' in data:
        report.state = data['state']

    report.save()

    report_user_id = report.user_id
    if report_user_id:
        user = User.objects(id=report_user_id, is_active = True).first()
        if user:
            return success("Notificable", 200)

    return success("Report updated successfully", 200)





@report_bp.route('/user', methods=['GET'])
def get_user_reports():
    # Extraer email y provider desde la query string
    email = request.args.get('email')
    provider = request.args.get('provider')

    if not email or not provider:
        return jsonify({"error": "Missing email or provider"}), 400

    # Buscar el usuario basado en el email y provider
    try:
        user = User.objects.get(email=email, provider=provider, is_active = True)
    except DoesNotExist:
        return jsonify({"error": "User not valid"}), 404

    # ——————————— Parámetros de paginación ———————————
    cursor = request.args.get('cursor', default=0, type=int)
    limit = 9

    # ——————————— Parámetros de filtrado ———————————
    # Orden (sortBy puede ser: date_desc, date_asc, content_asc, content_desc)
    sort_by = request.args.get('sortBy', default='date_desc')
    # Búsqueda por email de usuario (substring, case‑insensitive)
    # Hate filters: include both por defecto, se pueden pasar como 'true'/'false'
    include_hate = request.args.get('includeHate', 'true') == 'true'
    include_not_hate = request.args.get('includeNotHate', 'true') == 'true'
    # Status: lista de estados a mostrar, ejemplo ?status=processing&status=accepted&status=rejected
    statuses = request.args.getlist('status')

    # ——————————— Construcción del query ———————————
    q = Report.objects(user_id=str(user.id)).order_by('-created_at')
    return apply_filters(q, include_hate, include_not_hate, statuses, sort_by, cursor, limit)


def apply_filters(q, include_hate, include_not_hate, statuses, sort_by, cursor, limit):
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

@report_bp.route('/admin', methods=['GET'])
def get_admin_reports():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Missing email"}), 400

    try:
        user = User.objects.get(email=email, provider="credentials", is_active = True)
    except DoesNotExist:
        return jsonify({"error": "User not valid"}), 404

    if not user.is_admin:
        return jsonify({"error": "User not valid"}), 404

    # ——————————— Parámetros de paginación ———————————
    cursor = request.args.get('cursor', default=0, type=int)
    limit = request.args.get('limit', default=9, type=int)

    # ——————————— Parámetros de filtrado ———————————
    # Orden (sortBy puede ser: date_desc, date_asc, content_asc, content_desc)
    sort_by     = request.args.get('sortBy', default='date_desc')
    # Búsqueda por email de usuario (substring, case‑insensitive)
    search_email = request.args.get('searchEmail', default=None)
    # Hate filters: include both por defecto, se pueden pasar como 'true'/'false'
    include_hate     = request.args.get('includeHate',  'true') == 'true'
    include_not_hate = request.args.get('includeNotHate','true') == 'true'
    # Status: lista de estados a mostrar, ejemplo ?status=processing&status=accepted&status=rejected
    statuses = request.args.getlist('status')

    # ——————————— Construcción del query ———————————
    q = Report.objects(notification_email__ne=email)

    # Filtrado por substring de email
    if search_email:
        q = q.filter(notification_email__icontains=search_email)

    return apply_filters(q, include_hate, include_not_hate, statuses, sort_by, cursor, limit)



@report_bp.route('/stats/hate', methods=['GET'])
def hate_statistics():
    # 1) Parseamos days
    try:
        days = int(request.args.get('days', 7))
    except ValueError:
        return jsonify({"error": "Invalid 'days' parameter"}), 400

    # 2) Calculamos rango de fechas en UTC
    end = datetime.now(UTC)
    start = end - timedelta(days=days)

    # 3) Hacemos dos conteos
    hate_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        is_hate=True
    ).count()

    not_hate_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        is_hate=False
    ).count()

    data = [
        {
          "tag": "Hate",
            "number": hate_count,
        },
        {
            "tag": "Not_Hate",
            "number": not_hate_count,
        }
    ]

    return jsonify(data), 200

@report_bp.route('/stats/status', methods=['GET'])
def status_statistics():
    # Parseamos days
    try:
        days = int(request.args.get('days', 7))
    except ValueError:
        return jsonify({"error": "Invalid 'days' parameter"}), 400

    # Rango de fechas
    end = datetime.now(UTC)
    start = end - timedelta(days=days)

    # Conteos para cada status
    processing_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        state="processing"
    ).count()

    accepted_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        state="accepted"
    ).count()

    rejected_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        state="rejected"
    ).count()

    # Formateamos array para el grafico
    data = [
        {
            "tag": "Processing",
            "number": processing_count,

        },
        {
            "tag": "Accepted",
            "number": accepted_count,
        },
        {
            "tag": "Rejected",
            "number": rejected_count,
        },
    ]

    return jsonify(data), 200

@report_bp.route('/stats/registered', methods=['GET'])
def registerd_statistics():
    # Parseamos days
    try:
        days = int(request.args.get('days', 7))
    except ValueError:
        return jsonify({"error": "Invalid 'days' parameter"}), 400

    # Rango de fechas
    end = datetime.now(UTC)
    start = end - timedelta(days=days)

    # Conteos para cada status
    registered_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        user_id__exists=True
    ).count()

    # Informes de usuarios no registrados (no tienen user_id)
    unregistered_count = Report.objects(
        created_at__gte=start,
        created_at__lte=end,
        user_id__exists=False
    ).count()

    # Formateamos array para el grafico
    data = [
        {
            "tag": "Registered",
            "number": registered_count,

        },
        {
            "tag": "Unregistered",
            "number": unregistered_count,
        }
    ]

    return jsonify(data), 200

@report_bp.route('/stats/reports', methods=['GET'])
def reports_stats():
    #Leer parámetro y calcular rango
    days = int(request.args.get("days", 90))
    end = datetime.utcnow()
    start = end - timedelta(days=days)

    #Traer solo los campos necesarios
    qs = Report.objects(
        created_at__gte=start,
        created_at__lte=end
    ).only("created_at")
    qs_all = Report.objects().only("resolutions.created_at")

    #Construir listas de fechas
    report_dates = []
    resolution_dates = []
    for rpt in qs:
        report_dates.append({"date": rpt.created_at})
        
    for rpt in qs_all:
        for res in rpt.resolutions:
            dt = res.created_at
            # si viene con tz, lo hacemos naive UTC
            if getattr(dt, "tzinfo", None):
                dt = dt.astimezone(UTC).replace(tzinfo=None)
            # filtramos en el rango
            if start <= dt <= end:
                resolution_dates.append({"date": dt})

    #Crear DataFrames
    df_r = pd.DataFrame(report_dates)
    df_s = pd.DataFrame(resolution_dates)

    #Helper para agrupar + rellenar
    def group_and_fill(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
        # Generar la lista de todos los días (date objects) en el rango
        all_days = pd.date_range(start.date(), end.date(), freq="D").date

        #Si no hay datos, devolvemos un DataFrame de ceros para todos los días
        if df.empty:
            return pd.DataFrame({
                "day": [d.strftime("%Y-%m-%d") for d in all_days],
                col_name: [0] * len(all_days)
            })

        #Convertir a datetime y extraer solo la fecha (sin hora)
        df = df.copy()
        df["day"] = pd.to_datetime(df["date"]).dt.date

        #Contar ocurrencias por día
        grp = df.groupby("day").size()

        #Reindexar para incluir todos los días y rellenar con 0 donde falte
        grp = grp.reindex(all_days, fill_value=0)

        #Construir DataFrame final
        return pd.DataFrame({
            "day": [d.strftime("%Y-%m-%d") for d in all_days],
            col_name: grp.values
        })

    #Agrupar/rellenar por reports y resolutions
    df_reports = group_and_fill(df_r, "reports")
    df_resols  = group_and_fill(df_s, "resolutions")

    #Mergear ambos resultados
    df_final = pd.merge(
        df_reports,
        df_resols,
        on="day",
        how="inner"  # ambos tienen mismos días
    )

    #Convertir a lista de dicts
    result = df_final.to_dict(orient="records")

    return jsonify(result), 200



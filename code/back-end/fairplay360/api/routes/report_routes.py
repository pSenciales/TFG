from flask import Blueprint, request

from api.middleware import verify_session
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


import json
from flask import request, jsonify
from mongoengine import DoesNotExist


@report_bp.route('/user', methods=['GET'])
def get_user_reports():
    # Extraer email y provider desde la query string
    email = request.args.get('email')
    provider = request.args.get('provider')

    if not email or not provider:
        return jsonify({"error": "Missing email or provider"}), 400

    # Buscar el usuario basado en el email y provider
    user = User.objects(email=email, provider=provider).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Parámetros de paginación: cursor (offset) y limit
    cursor = request.args.get('cursor', default=0, type=int)
    limit = 1

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



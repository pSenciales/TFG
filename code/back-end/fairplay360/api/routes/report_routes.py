from flask import Blueprint, request

from api.model import Report, User, State
from api.routes.utils import *

report_bp = Blueprint('report_routes', __name__, url_prefix='/reports')


@report_bp.route('/', methods=['GET'])
@report_bp.route('', methods=['GET'])
def get_reports():
    reports = Report.objects()
    if not reports:
        return jsonify({}), 200
    return jsonify(reports.to_json()), 200


@report_bp.route('/', methods=['POST'])
@report_bp.route('', methods=['POST'])
def create_report():
    data = request.get_json()

    # Verifica campos obligatorios (no es necesario el campo state, ya que tiene valor por defecto)
    if missing := missing_fields(["content", "is_hate", "user_id"], data):
        return missing

    # Convierte el valor de 'state' a enum. Si no se envía, se usa el valor por defecto 'processing'
    state_value = data.get('state', 'processing')
    try:
        state_enum = State(state_value.lower())
    except ValueError:
        return jsonify({"error": "Invalid state value"}), 422

    # Se pueden pasar opcionalmente imágenes, pdf y resoluciones si se envían en el JSON,
    # de lo contrario se asigna una lista vacía (lo que coincide con el default en el modelo)
    report = Report(
        content=data['content'],
        state=state_enum,
        source=data.get('source'),
        is_hate=data['is_hate'],
        user_id=data['user_id'],
        images=data.get('images', []),
        pdf=data.get('pdf', []),
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

@report_bp.route('/user/<user_id>', methods=["GET"])
def get_user_reports(user_id):
    user = User.objects(id=user_id).first()

    if not_found := element_not_found(user, "User not found"):
        return not_found

    reports = Report.objects(user_id=user_id).order_by('-created_at')
    if not reports:
        return jsonify({}), 200
    return jsonify(reports.to_json()), 200


from flask import Blueprint, request

from model import Report, User
from routes.utils import *

report_bp = Blueprint('report_routes', __name__, url_prefix='/reports')


@report_bp.route('/', methods=['GET'])
@report_bp.route('', methods=['GET'])
def get_reports():
    reports = Report.objects().to_json()
    return jsonify(reports), 200


@report_bp.route('/', methods=['POST'])
@report_bp.route('', methods=['POST'])
def create_report():
    data = request.get_json()

    if missing := missing_fields(["content", "source", "is_hate", "files", "user_id"], data):
        return missing

    report = Report(
        content=data['content'],
        source=data.get('source'),
        is_hate=data['is_hate'],
        files=data.get('files'),
        user_id=data['user_id']
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

    reports = Report.objects(user_id=user_id).order_by('-created_at').to_json()
    return jsonify(reports), 200


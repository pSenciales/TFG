from flask import Blueprint, request, jsonify
from model import Report

report_bp = Blueprint('report_routes', __name__, url_prefix='/reports')


@report_bp.route('/', methods=['GET'])
def get_reports():
    reports = Report.objects()
    return jsonify(reports), 200


@report_bp.route('/', methods=['POST'])
def create_report():
    data = request.get_json()

    if not all(key in data for key in ['content', 'is_hate', 'user_id']):
        return jsonify({"error": "Missing required fields"}), 400

    report = Report(
        content=data['content'],
        source=data.get('source'),
        is_hate=data['is_hate'],
        files=data.get('files'),
        user_id=data['user_id']
    )
    report.save()

    return jsonify({"message": "Report created successfully", "report": report.to_json()}), 201


@report_bp.route('/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    report = Report.objects(id=report_id).first()

    if not report:
        return jsonify({"error": "Report not found"}), 404

    report.delete()
    return jsonify({"message": "Report deleted successfully"}), 200


@report_bp.route('/<report_id>', methods=['PUT'])
def update_report(report_id):
    report = Report.objects(id=report_id).first()

    if not report:
        return jsonify({"error": "Report not found"}), 404

    data = request.get_json()

    if 'resolutions' in data:
        report.resolutions.extend(data['resolutions'])

    if 'state' in data:
        report.state = data['state']

    report.save()
    return jsonify({"message": "Report updated successfully"}), 200

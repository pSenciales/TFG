from flask import jsonify

# Verify if there are missing fields in the request
def missing_fields(required_fields, data):

    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    return None

#Verificy if the element is null
def element_not_found(element, message):
    if not element:
        return jsonify({"error": message}), 404

    return None

#Returns success message
def success(message, code):
    return jsonify({"success": message}), code
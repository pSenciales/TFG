from flask import Flask, request, jsonify
from PIL import Image
import pytesseract

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    image_file = request.files.get('image')
    if not image_file:
        return jsonify({"status": "error", "message": "No image provided"}), 400

    image_data = Image.open(image_file)

    # Perform OCR using PyTesseract
    text = pytesseract.image_to_string(image_data)

    response = {
        'status': 'success',
        'text': text
    }

    return jsonify(response)

if __name__ == "__main__":
    # Usa app.run(host="0.0.0.0") para que sea accesible desde fuera del contenedor
    app.run(host="0.0.0.0")

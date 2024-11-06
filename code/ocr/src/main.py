from PIL import Image, ImageFilter
import pytesseract
import os

# Establece la ruta de Tesseract específica para el contenedor Linux
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

# Configura la variable de entorno TESSDATA_PREFIX para los archivos de idioma
os.environ['TESSDATA_PREFIX'] = '/usr/share/tesseract-ocr/4.00/tessdata/'

# Cargar la imagen
image = Image.open('test.png')

# Opcional: aplicar algún preprocesamiento a la imagen
processed_image = image.convert('L').filter(ImageFilter.SHARPEN)

# Realizar OCR en la imagen en español
text = pytesseract.image_to_string(processed_image)

# Imprimir el resultado
print("Texto extraído de la imagen:")
print(text)

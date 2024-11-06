# Usa una imagen de Python slim como base, que es ligera
FROM python:3.9-slim

# Actualiza los paquetes e instala Tesseract OCR y el paquete de idioma en español
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-spa libglib2.0-0 && \
    apt-get clean

# Instala las dependencias de Python necesarias para OCR
RUN pip install pytesseract pillow

# Copia el código Python y la imagen de prueba en el contenedor
WORKDIR /src
COPY main.py .
COPY test.png .

# Configura la variable de entorno correcta para los archivos de idioma
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/tessdata/

# Ejecuta el script cuando se inicie el contenedor
CMD ["python", "main.py"]

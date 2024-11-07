# Usa una imagen base de Python
FROM python:3.10-slim

# Instala Tesseract y demás dependencias del sistema necesarias
RUN apt-get update && \
    apt-get install -y tesseract-ocr && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de tu proyecto a la imagen
COPY . .

# Instala las dependencias de Python necesarias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto que usará Flask (5000 por defecto)
EXPOSE 5000

# Ejecuta la aplicación
CMD ["python", "app.py"]

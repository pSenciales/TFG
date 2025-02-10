# TFG
Este es el repositorio donde estará todo el código de la aplicación web Fairplay360.




## ¿Cuál es el objetivo?
Crear un portal web de detección y denuncia automática de discurso de odio, centrándome en el contexto del fútbol. 
Viene motivada, primero por mi interés en hacer una web que implemente LLMs y funcionalidades atractivas, también por mi interés en este deporte.

## Tecnologías que se van a utilizar a priori
* Nextjs
* Flask
* Azure
* Docker
* Vercel
  
## Estado actual
A día de hoy está hecho:
* Microservicio encargado del OCR utilizando pytesseract (Alojado en Render, latencia de hasta 50s por plan gratuito)
* Vista de prueba para probar este OCR (https://fairplay360.vercel.app) y también algún componente de https://ui.shadcn.com/
* Servicio en Azure con deepseek, no implementado por temas de latencias y timeout de Vercel 

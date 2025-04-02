const pdfReportTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Fairplay</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
        .highlight {
            color: #333;
            font-weight: bold;
        }
        .cta-link {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .cta-link:hover {
            background-color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hola, {{name}}</h1>
        <p>Gracias por utilizar <strong>Fairplay360</strong>. Hemos analizado tu contenido y obtuvimos el siguiente resultado:</p>
        <p>
            <span class="highlight">Análisis:</span> {{result}}
        </p>

        <p>
            Adjunto encontrarás tu reporte en formato PDF con más detalles
            sobre la verificación. 
            {{#linkToPdf}}
                También puedes <a class="cta-link" href="{{linkToPdf}}" target="_blank">verlo en línea</a>.
            {{/linkToPdf}}
        </p>
        
        <p class="footer">Si no solicitaste este reporte, ignora este correo.</p>
    </div>
</body>
</html>
`;

export default pdfReportTemplate;

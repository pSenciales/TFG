const statusTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación de Estado</title>
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
        .status {
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
            color: #ffffff;
        }
        .status.approved {
            background-color: #28a745;
        }
        .status.pending {
            background-color: #ffc107;
            color: #333;
        }
        .status.declined {
            background-color: #dc3545;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Actualización de Estado</h1>
        <p>Hola {{name}}. Una de tus denuncias ha cambiado de estado. Consulta los detalles a continuación:</p>
        <div class="status {{statusClass}}">Estado: {{status}}</div>
        <p>Haz clic en el botón de abajo para ver tus denuncias:</p>
        <a href="https://fairplay360.vercel.app" class="button">Ver mis denuncias</a>
        <p class="footer">Si no esperabas esta actualización, ignora este correo.</p>
    </div>
</body>
</html>

`;

export default statusTemplate;
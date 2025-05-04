const resetPasswordTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación</title>
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
        .otp {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
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
        <h1>Hola, {{name}}. Cambia tu contraseña.</h1>
        <p>Pulsa el siguiente enlace para resetear tu contraseña. No compartas este código con nadie.</p>
        <a class="otp" href="{{link}}">Click here!</a>
        <p>Este enlace solo tiene 10 minutos de validez.</p>
        <p class="footer">Si no solicitaste este código, ignora este correo.</p>
    </div>
</body>
</html>

`;

export default resetPasswordTemplate;
const welcomeTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { background: white; padding: 20px; border-radius: 10px; text-align: center; }
    .button { display: inline-block; padding: 10px 20px; background:rgb(0, 0, 0); color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>¡Bienvenido, {{name}}!</h2>
    <p>Gracias por registrarte en nuestra plataforma.</p>
    <p><a href="{{confirmLink}}" class="button">Confirmar Email</a></p>
  </div>
</body>
</html>
`;

export default welcomeTemplate;
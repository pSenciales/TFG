const resetPasswordTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .black-bar {
            width: 100%;
            height: 40px;
            background-color: #000000;
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
            font-size: 20px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
            background-color: #333;
            color: #fff;
            text-decoration: none;
        }
        .otp:hover {
            background-color: #555;
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
        <div class="black-bar"></div>
        
        <h1>Hello, {{name}}. Reset your password.</h1>
        <p>Click the following link to reset your password. Do not share this code with anyone.</p>
        <a class="otp" href="{{link}}">Click here!</a>
        <p>This link is only valid for 10 minutes.</p>
        <p class="footer">If you did not request this code, please ignore this email.</p>

        <div class="black-bar"></div>
    </div>

</body>
</html>


`;

export default resetPasswordTemplate;
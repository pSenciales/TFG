const statusTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Notification</title>
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
        .status {
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
            color: #ffffff;
        }
        .status.accepted {
            background-color: #28a745;
        }
        .status.processing {
            background-color: #ffc107;
            color: #333;
        }
        .status.rejected {
            background-color: #dc3545;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none !important;
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
        <div class="black-bar"></div>
        <h1>Status Update</h1>
        <p>Hello {{name}}. One of your reports has changed status. See the details below:</p>
        <div class="status {{statusClass}}">Status: {{status}}</div>
        <p>Reason: {{reason}}</p>
        <p>Click the button below to view your reports:</p>
        <a href="https://fairplay360.vercel.app/en/my-reports" class="button">View My Reports</a>
        <p class="footer">If you weren't expecting this update, please ignore this email.</p>
        
        <div class="black-bar"></div>
    </div>

</body>
</html>


`;

export default statusTemplate;
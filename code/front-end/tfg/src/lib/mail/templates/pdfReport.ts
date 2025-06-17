const pdfReportTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fairplay Report</title>
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
        <div class="black-bar"></div>
        <h1>Hello, {{name}}</h1>
        <p>Thank you for using <strong>Fairplay360</strong>. We have analyzed your content and obtained the following result:</p>
        <p>
            <span class="highlight">Analysis:</span> {{result}}
        </p>

        <p>
            Attached you'll find your report in PDF format with more details
            about the verification.
            {{#linkToPdf}}
                You can also <a class="cta-link" href="{{linkToPdf}}" target="_blank">view it online</a>.
            {{/linkToPdf}}
        </p>

        <p class="footer">If you did not request this report, please ignore this email.</p>
        <div class="black-bar"></div>
    </div>
    
</body>
</html>
`;

export default pdfReportTemplate;

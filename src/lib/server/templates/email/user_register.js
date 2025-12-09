import { replaceStringTemplate } from "./utils.js";

export const userRegister = (user, password) => {
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a OpenFusionAPI</title>
    <style type="text/css">
        /* Reset para clientes de email */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f7f9fc;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
        }
        .header {
            background-color: #ffffff;
            padding: 30px 20px 20px;
            text-align: center;
            border-bottom: 3px solid #4f46e5;
        }
        .logo {
            max-width: 180px;
            height: auto;
        }
        .content {
            background-color: #ffffff;
            padding: 30px 20px;
            line-height: 1.6;
        }
        .password-box {
            background-color: #f3f4f6;
            border-left: 4px solid #4f46e5;
            padding: 15px;
            margin: 25px 0;
            font-family: 'Courier New', Courier, monospace;
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            word-break: break-all;
        }
        .footer {
            background-color: #f7f9fc;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #4338ca;
        }
        h1 {
            color: #1f2937;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #4b5563;
        }
        .highlight {
            color: #4f46e5;
            font-weight: bold;
        }
        .steps {
            background-color: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .steps h3 {
            color: #0369a1;
            margin-top: 0;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px 15px !important;
            }
        }
    </style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f9fc">
        <tr>
            <td align="center" valign="top">
                <!-- Contenedor principal -->
                <table class="container" cellpadding="0" cellspacing="0" border="0" width="600">
                    <!-- Header con logo -->
                    <tr>
                        <td class="header">
                            <img src="https://www.openfusionapi.com/favicon.ico" alt="OpenFusionAPI Logo" class="logo">
                        </td>
                    </tr>
                    
                    <!-- Contenido principal -->
                    <tr>
                        <td class="content">
                            <h1>Welcome to OpenFusionAPI!</h1>
                            
                            <p>Hi <span class="highlight">$USER$</span>,</p>
                            
                            <p>We are delighted to welcome you to our platform. Your registration has been completed successfully and you are now part of our developer community.</p>
                            
                            <p>You are one step away from being able to access all the features that OpenFusionAPI has to offer.</p>
                            
                            <div class="steps">
                                <h3>Your next step:</h3>
                                <p>Use the following temporary password to log in for the first time:</p>
                                
                                <div class="password-box">
                                    $PWD$
                                </div>
                                
                                <p><strong>Safety recommendation:</strong> We suggest you change this password after your first login in your account settings section.</p>
                            </div>
                            
                            <p>To begin exploring all the features, click the button below:</p>
                            
                            <div style="text-align: center;">
                                <a href="https://www.openfusionapi.com" class="button">Access my account</a>
                            </div>
                            
                            <p>If you have any questions or need assistance, please don't hesitate to contact our support team. We're here to help you every step of the way.</p>
                            
                            <p>We hope you have an exceptional experience with OpenFusionAPI!</p>
                            
                            <p>Sincerely,<br>
                            <strong>The OpenFusionAPI team</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>© 2025 OpenFusionAPI. All rights reserved.</p>
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p><a href="https://www.openfusionapi.com" style="color: #4f46e5;">Visit our website</a> | <a href="https://www.openfusionapi.com" style="color: #4f46e5;">Support</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const reemplazos = {
    $USER$: user,
    $PWD$: password,
  };

  return replaceStringTemplate(html, reemplazos);
};

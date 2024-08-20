function forgotPasswordTemplate(user, link){
    return `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .header img {
                            max-width: 150px;
                            height: auto;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h1 {
                            font-size: 24px;
                            color: #333;
                        }
                        .content p {
                            font-size: 16px;
                        }
                        .button {
                            display: inline-block;
                            font-size: 16px;
                            color: #fff;
                            background-color: #007bff;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            margin-top: 20px;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                            text-align: center;
                        }
                        .footer a {
                            color: #007bff;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <!-- Optionally add a logo here -->
                            <img src="https://w7.pngwing.com/pngs/925/348/png-transparent-logo-online-and-offline-e-online-design-text-logo-online-and-offline.png" alt="Company Logo">
                        </div>
                        <div class="content">
                            <h1>Password Reset Request</h1>
                            <p>Hello ${user.name},</p>
                            <p>We received a request to reset your password. Please click the button below to create a new password.</p>
                            <a href=${link} class="button">Reset Password</a>
                            <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
                            <p>For any assistance, feel free to contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 [Company Name]. All rights reserved.</p>
                            <p><a href="https://example.com/support">Support</a> | <a href="https://example.com/terms">Terms of Service</a> | <a href="https://example.com/privacy">Privacy Policy</a></p>
                        </div>
                    </div>
                </body>
            </html>
    `
}
module.exports = forgotPasswordTemplate;
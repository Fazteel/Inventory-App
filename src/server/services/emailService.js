const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class EmailService {
  constructor() {
    console.log("Initializing EmailService with Zoho configuration:", {
      user: process.env.ZOHO_EMAIL,
    });

    this.transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
      debug: true,
      logger: true,
    });
  }

  generateVerificationToken(userData) {
    return jwt.sign(
      userData,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async sendWelcomeEmail(to, username, tempPassword) {
    try {
      const verificationToken = this.generateVerificationToken({ email: to, username });
      const setPasswordLink = `${process.env.CLIENT_URL}/set-password?token=${verificationToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 0.8em;
              color: #6c757d;
            }
            .credentials {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Welcome to StockHawk!</h1>
            </div>
            <div class="content">
              <p>Hello ${username},</p>
              <p>Your account has been successfully created in the StockHawk system.</p>
              
              <div class="credentials">
                <p><strong>Your temporary login credentials:</strong></p>
                <p>Username: ${username}</p>
                <p>Temporary Password: ${tempPassword}</p>
              </div>

              <p><strong>Important:</strong> For security reasons, please set your new password immediately by clicking the button below:</p>
              
              <div style="text-align: center; color: white;">
                <a href="${setPasswordLink}" class="button">Set Your Password</a>
              </div>

              <p><strong>Please note:</strong></p>
              <ul>
                <li>This link will expire in 24 hours</li>
                <li>For security reasons, you must set a new password before accessing the system</li>
                <li>Make sure to choose a strong password that you haven't used elsewhere</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>If you didn't request this account, please contact your system administrator immediately.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log("Preparing welcome mail...");
      const mailOptions = {
        from: `"StockHawk" <${process.env.ZOHO_EMAIL}>`,
        to,
        subject: "Welcome to StockHawk - Set Your Password",
        html: htmlContent
      };

      console.log("Sending welcome mail...");
      const result = await this.transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Detailed error in sendWelcomeEmail:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  // Mempertahankan method sendMail original untuk kebutuhan lain
  async sendMail(to, subject, text) {
    try {
      console.log("Preparing mail options...");
      const mailOptions = {
        from: `"StockHawk" <${process.env.ZOHO_EMAIL}>`,
        to,
        subject,
        text,
      };

      console.log("Sending mail...");
      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Detailed error in sendMail:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
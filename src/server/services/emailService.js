const nodemailer = require("nodemailer");

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

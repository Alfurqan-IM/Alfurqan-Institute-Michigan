const nodemailer = require("nodemailer");
const config = require("./smtpConfig");

const sendEmail = async ({ to, subject, message, html }) => {
  let transporter = nodemailer.createTransport(config);
  let info = await transporter.sendMail({
    from: '"AlFurqan Institute Michigan" <alfurqanaim@gmail.com>', 
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

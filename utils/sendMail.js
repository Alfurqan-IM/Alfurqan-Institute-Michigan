const nodemailer = require("nodemailer");
const config = require("./smtpConfig");

const sendEmail = async ({ to, subject, message, html }) => {
  let transporter = nodemailer.createTransport(config);
  let info = await transporter.sendMail({
    from: '"AlFurqan IM from " <alfurqanaim@gmail.com>', 
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

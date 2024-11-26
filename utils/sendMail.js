const nodemailer = require("nodemailer");
const config = require("./smtpConfig");

const sendEmail = async ({ to, subject, message, html }) => {
  let transporter = nodemailer.createTransport(config);
  let info = await transporter.sendMail({
    from: '"Scout bee 🐝 from " <apiariessixteen@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;

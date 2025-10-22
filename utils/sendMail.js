// const nodemailer = require("nodemailer");
// const config = require("./smtpConfig");

// const sendEmail = async ({ to, subject, message, html }) => {
//   let transporter = nodemailer.createTransport(config);
//   let info = await transporter.sendMail({
//     from: '"AlFurqan Institute Michigan" <alfurqanaim@gmail.com>', 
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;


const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "AlFurqan Institute <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Email send failed:", error);
  }
};

module.exports = sendEmail;

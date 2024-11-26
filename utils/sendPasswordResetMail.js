const sendEmail = require("./sendMail");
const Mailgen = require("mailgen");
const moment = require("moment");

const sendPasswordResetMail = ({ origin, email, passwordToken, fullname }) => {
  // const resetPassword = `${origin}/authflow/resetpassword?token=${passwordToken}&email=${email}`;
  const resetPassword = `${origin}/authentication/reset-password?token=${passwordToken}&email=${email}`;
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "Apiaries 16",
      link: "https://oyintola.onrender.com", //mark
      logo: "https://res.cloudinary.com/dod7yij4e/image/upload/v1696673083/Product%20Images/tmp-1-1696673080565_vbd2xl.png",
      logoHeight: "120px",
      copyright: ` © ${new Date().getFullYear()} Apiaries 16. All rights reserved.`,
    },
  });
  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: "https://img.icons8.com/fluency/48/facebook.png",
      link: "http://www.facebook.com/oyintolabeads",
    },
    {
      name: "Twitter",
      icon: "https://img.icons8.com/color/48/twitter--v1.png",
      link: "https://twitter.com/AmeenatHWB?t=49dFQ-1i7q54H8kelObFbg&s=09",
    },
    {
      name: "Instagram",
      icon: "https://img.icons8.com/color/48/instagram-new--v1.png",
      link: "https://instagram.com/oyintolabeads?igshid=MzNlNGNkZWQ4Mg==",
    },
    {
      name: "whatsApp",
      icon: "https://img.icons8.com/color/48/whatsapp--v1.png",
      link: "https://bit.ly/Oyintolabeads",
    },
  ];

  const socialMediaLinksHTML = socialMediaLinks
    .map(
      (link) =>
        `<a href="${link.link}" target="_blank"><img  src="${link.icon}" alt="${link.name} Icon"></a>`
    )
    .join("  ");

  const Email = {
    body: {
      name: fullname,
      intro: "Reset your Password",
      action: {
        instructions:
          "Please reset your password by clicking on the action button",
        button: {
          color: "#22BC66",
          text: "Confirm",
          link: `${resetPassword}`,
        },
      },
      greeting: "Dear",
      signature: "Sincerely",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",

      dictionary: {
        date: moment().format("MMMM Do YYYY"),
        address:
          "Apiaries 16, beside Jezdeb filling station Agbabaika, Gaa-Akanbi, Ilorin",
        handles: socialMediaLinksHTML,
      },
    },
  };

  const emailBody = mailGenerator.generate(Email);
  return sendEmail({
    to: email,
    subject: "Pasword Reset",
    html: emailBody,
  });
};

module.exports = sendPasswordResetMail;

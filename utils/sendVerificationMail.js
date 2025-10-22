const sendEmail = require("./sendMail");
const Mailgen = require("mailgen");
const moment = require("moment");

const sendVerificationMail = ({
  origin,
  email,
  verificationString,
  fullname,
}) => {
  const { first_name, last_name } = fullname;
  const verifyEmail = `${origin}/authentication/verify-email?token=${verificationString}&email=${email}`;
  // console.log(verifyEmail);
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "AlFurqan Institute Michigan",
      link: "#", //mark
      logo: "https://res.cloudinary.com/dtrdvz70q/image/upload/v1733324658/Alfurqan%20Institue%20Michigan/alfuraqan_logo_2.jpg",
      logoHeight: "120px",
      copyright: ` © ${new Date().getFullYear()} AlFurqan Institute Michigan. All rights reserved.`,
    },
  });
  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: "https://img.icons8.com/fluency/48/facebook.png",
      link: "https://www.facebook.com/profile.php?id=61569614254645",
    },
    {
      name: "Twitter",
      icon: "https://img.icons8.com/color/48/twitter--v1.png",
      link: "https://x.com/AlfurqanMich?t=BhE9yvT1wPGvlTjWaMxCBw&s=09",
    },
    {
      name: "Instagram",
      icon: "https://img.icons8.com/color/48/instagram-new--v1.png",
      link: "https://www.instagram.com/alfurqanmichigan?igsh=OGlnb3U5YWloejcw",
    },
    {
      name: "whatsApp",
      icon: "https://img.icons8.com/color/48/whatsapp--v1.png",
      link: "#",
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
      name: `${first_name} ${last_name}`,
      intro: "Confirm your Email",
      action: {
        instructions:
          "Please confirm your Email by clicking on the action button",
        button: {
          color: "#22BC66",
          text: "Confirm",
          link: `${verifyEmail}`,
        },
      },
      greeting: "Dear",
      signature: "Sincerely",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",

      dictionary: {
        date: moment().format("MMMM Do YYYY"),
        address: "AlFurqan Institute Michigan",
        handles: socialMediaLinksHTML,
      },
    },
  };

  const emailBody = mailGenerator.generate(Email);
  return sendEmail({
    to: email,
    subject: "Email Verification",
    html: emailBody,
  });
};

module.exports = sendVerificationMail;

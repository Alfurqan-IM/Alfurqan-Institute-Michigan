const sendEmail = require("./sendMail");
const Mailgen = require("mailgen");
const moment = require("moment");

const sendDeliveryStatusEmail = async ({
  email,
  fullname,
  deliveryStatus,
  productNames,
  orderId,
  deliveryAddress: { street, city, state, country, phone },
}) => {
  let message;

  switch (deliveryStatus) {
    case "delivered":
      message = `<p>We are glad to inform you that we have successfully delivered your order to the provided address:</br>${street}, ${city}, ${state}, ${country}</br>The recipient's phone number is ${phone}</p>`;
      break;
    case "canceled":
      message = `<p>Thank you for considering shopping with us. We regret to inform you that your order has been canceled. If you have any inquiries, please don't hesitate to contact our dedicated support team.</p>`;
      break;
    default:
      message = `<p>Thank you for shopping with us. We would like to inform you that your order is currently in ${deliveryStatus} status. If you have any concerns or need further assistance, please feel free to contact our support team. </p>`;
      break;
  }

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
      intro: [
        "Delivery status update",
        `This is an update on your order with id ${orderId} for ${productNames}`,
        `${message}`,
      ],
      greeting: "Dear",
      signature: "Sincerely",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
      goToAction: {
        text: "My Orders",
        link: "https://oyintola.onrender.com/user/orders", //mark
        description: "Check the status of your order(s) in your account",
      },
      dictionary: {
        date: moment().format("MMMM Do YYYY"),
        address:
          "Folramart thrift Store, beside Jezdeb filling station Agbabaika, Gaa-Akanbi, Ilorin",
        handles: socialMediaLinksHTML, // Include the social media icons
      },
    },
  };

  const emailBody = mailGenerator.generate(Email);
  return sendEmail({
    to: email,
    subject: "Delivery Successful",
    html: emailBody,
  });
};

module.exports = sendDeliveryStatusEmail;

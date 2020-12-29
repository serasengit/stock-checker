const configService = require("../services/config.service.js");
const configMensaje = require("../modules/configMensaje");
const fs = require("fs");

async function sendEmail(mail) {
  try {
    mail.transporter.sendMail(mail.mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email was sent succesfully!");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

exports.sendStockProductsEmail = async function (subject, stockProducts) {
  const emailAddress = await configService.findByClave("email");
  const emailPass = await configService.findByClave("email_pass");
  const mail = new configMensaje.buildMail(
    emailAddress[0].value,
    emailPass[0].value,
    subject,
    configMensaje.getStockProductsEmailBody(stockProducts)
  );
  sendEmail(mail);
};

exports.sendOrderedProductEmail = async function (subject, orderConfirmation) {
  const emailAddress = await configService.findByClave("email");
  const emailPass = await configService.findByClave("email_pass");
  const mail = new configMensaje.buildMail(
    emailAddress[0].value,
    emailPass[0].value,
    subject,
    null,
    [
      {
        filename: "orderConfirmation.jpg",
        content: orderConfirmation,
      },
    ]
  );
  sendEmail(mail);
};

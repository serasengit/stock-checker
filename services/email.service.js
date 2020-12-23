// Import configMensage module
const configMensaje = require("../modules/configMensaje");
const Config = require("../db/models/config");

// Send an email.
exports.send_email = async function (availableProducts) {
  try {
    const emailAddress = await Config.query().where("clave", "email");
    if (emailAddress && emailAddress[0]) {
      const emailPass = await Config.query().where("clave", "email_pass");
      if (emailPass && emailPass[0]) {
        const mail = new configMensaje(
          emailAddress[0].value,
          emailPass[0].value,
          availableProducts
        );

        mail.transporter.sendMail(mail.mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email was sent succesfully!");
          }
        });
      } else {
        console.log("There was a problem trying to get the receiver data!");
      }
    } else {
      console.log("There was a problem trying to get the receiver data!");
    }
  } catch (err) {
    console.log(err);
  }
};

const nodemailer = require("nodemailer");
module.exports = function (emailAdress, emailPass) {
  this.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdress,
      pass: emailPass,
    },
  });
  this.mailOptions = {
    from: emailAdress,
    to: emailAdress,
    subject: "PC Componentes STOCK",
    html:
      "<strong>HAY STOCK DISPONIBLE DE</strong>" +
      "<br/><br/><href>" +
      url +
      "</strong>",
  };
};

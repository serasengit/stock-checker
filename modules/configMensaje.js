const nodemailer = require("nodemailer");
module.exports = function (emailAdress, emailPass, availableProducts) {
  this.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdress,
      pass: emailPass,
    },
  });
  let html =
    "<strong>HAY STOCK DISPONIBLE DE LOS SIGUIENTES PRODUCTOS: </strong><br/><br/>";
  availableProducts.forEach((availableProduct) => {
    html +=
      "<ul><li><strong>Product:</strong> " + availableProduct.title + "</li>";
    html += "<li><strong>Price:</strong> " + availableProduct.price + "</li>";
    html +=
      "<li><strong>URL:</strong> " +
      availableProduct.url +
      "</li></ul><br/><br/>";
  });
  this.mailOptions = {
    from: emailAdress,
    to: emailAdress,
    subject: "PC COMPONENTES STOCK",
    html,
  };
};

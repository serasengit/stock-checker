const nodemailer = require("nodemailer");
exports.buildMail = function buildMail(
  emailAdress,
  emailPass,
  subject,
  body,
  attachments
) {
  this.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAdress,
      pass: emailPass,
    },
  });
  const html = body;
  this.mailOptions = {
    from: emailAdress,
    to: emailAdress,
    subject,
    html,
    attachments,
  };
};

exports.getStockProductsEmailBody = function getStockProductsEmailBody(
  stockProducts
) {
  let html =
    "<strong>HAY STOCK DISPONIBLE DE LOS SIGUIENTES PRODUCTOS: </strong><br/><br/>";
  stockProducts.forEach((stockProduct) => {
    html +=
      "<ul><li><strong>Product:</strong> " +
      stockProduct.product_name +
      "</li>";
    html +=
      "<li><strong>Price:</strong> " + stockProduct.product_price + "</li>";
    html +=
      "<li><strong>URL:</strong> " + stockProduct.url + "</li></ul><br/><br/>";
  });
  return html;
};

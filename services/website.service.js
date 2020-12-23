const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios").default;

exports.getPage = async function (url) {
  try {
    const res = await axios.get(url);
    const availableProducts = getAvailableProducts(res.data);
    console.log(
      !availableProducts.length > 0
        ? "No hay productos disponibles"
        : "Los productos disponibles son: " + JSON.stringify(availableProducts)
    );
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

function getAvailableProducts(html) {
  const $ = cheerio.load(html);
  const availableProducts = [];
  $(".c-product-card__content").each((index, product) => {
    let title;
    let isAvailable = false;
    let url = "https://www.pccomponentes.com";
    let price;
    product.children.forEach((productInfo, index) => {
      if (productInfo.attribs.class === "c-product-card__header") {
        title = productInfo.lastChild.lastChild.lastChild.data;
        url += productInfo.lastChild.lastChild.attribs.href;
      }
      if (
        productInfo.attribs.class.includes("c-product-card__availability") &&
        productInfo.attribs.class.includes("disponibilidad-inmediata")
      )
        isAvailable = true;
      if (
        productInfo.attribs.class === "c-product-card__prices cy-product-price"
      )
        price = productInfo.lastChild.lastChild.lastChild.data;
    });
    if (isAvailable) availableProducts.push({ title, price, isAvailable, url });
  });

  return availableProducts;
}

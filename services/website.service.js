const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios").default;
const PC_COMPONENTES = "PC_COMPONENTES";
const AMAZON_SPAIN = "AMAZON_SPAIN";
const open = require("open");
const puppeteer = require("puppeteer");
const configService = require("../services/config.service.js");

exports.getPage = async function getPage(url, website) {
  try {
    const res = await axios.get(url);
    const availableProducts = getAvailableProducts(res.data, website);
    return availableProducts;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

exports.buyStockProduct = async function buyStockProduct(url, website) {
  var orderConfirmation;

  switch (website) {
    case PC_COMPONENTES:
      orderConfirmation = await buyPCComponentesAvailableProducts(url);
      break;
    case AMAZON_SPAIN:
      //availableProducts = buyAmazonSpainAvailableProducts(url);
      break;
  }

  return orderConfirmation;
};

async function buyPCComponentesAvailableProducts(url) {
  var orderConfirmation;
  let errTimes = 0;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  //Login
  console.log("Website Login Init");
  await loginToPCComponentes(page, url);
  console.log("Website Login Success");
  // Product buying
  do {
    console.log("Product buying- Init");
    try {
      await buyPCComponentesProduct(page);
      console.log("Product buying- end");
      orderConfirmation = await page.screenshot({ path: "order.png" });
      errTimes = 0;
    } catch (err) {
      errTimes++;
      console.log(err + " :: Time " + errTimes);
    }
  } while (errTimes < 300 && errTimes > 0);
  browser.close();
  console.log("Browser Closed");
  return orderConfirmation;
}

async function loginToPCComponentes(page, url) {
  await page.goto("https://www.pccomponentes.com/login");
  const pcComponentesUser = await configService.findByClave(
    "pc_componentes_user"
  );
  const pcComponentesPass = await configService.findByClave(
    "pc_componentes_pass"
  );
  await page.type("input[name=username]", pcComponentesUser[0].value);
  await page.type("input[name=password]", pcComponentesPass[0].value);
  await page.click("button[data-cy=log-in]");
  await page.waitForNavigation();
  await page.goto(url);
}

async function buyPCComponentesProduct(page) {
  console.log("Buy button click - Init");
  await page.click("#btnsWishAddBuy");
  await page.waitForSelector("#GTM-carrito-realizarPedidoPaso1", {
    visible: true,
    timeout: 3000,
  });
  console.log("Buy button click - End");
  console.log("Order product button click - Init");
  await page.click("#GTM-carrito-realizarPedidoPaso1");
  await page.waitForTimeout(3000);
  console.log("Order product button click - End");
  await page.waitForSelector("#GTM-carrito-finalizarCompra", {
    visible: true,
    timeout: 3000,
  });
  await page.click("#pccom-conditions");
  console.log("Finish order button click - Init");
  await page.click("#GTM-carrito-finalizarCompra");
  await page.waitForNavigation();
  console.log("Finish order button click - End");
}

function getAvailableProducts(html, website) {
  var availableProducts = [];

  switch (website) {
    case PC_COMPONENTES:
      availableProducts = getPCComponentesAvailableProducts(html);
      break;
    case AMAZON_SPAIN:
      //TODO
      //availableProducts = getAmazonSpainAvailableProducts(html);
      break;
  }
  return availableProducts;
}

function getPCComponentesAvailableProducts(html) {
  const availableProducts = [];
  const $ = cheerio.load(html);
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
        (productInfo.attribs.class.includes("disponibilidad-inmediata") ||
          productInfo.attribs.class.includes("disponibilidad-moderada"))
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

/* TODO
function getAmazonSpainAvailableProducts(html) {
  const availableProducts = [];
  const $ = cheerio.load(html);
  //TODO
  $(".s-main-slot s-result-list s-search-results sg-row").each(
    (index, product) => {
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
          productInfo.attribs.class ===
          "c-product-card__prices cy-product-price"
        )
          price = productInfo.lastChild.lastChild.lastChild.data;
      });
      if (isAvailable)
        availableProducts.push({ title, price, isAvailable, url });
    }
  );
  return availableProducts;
}*/

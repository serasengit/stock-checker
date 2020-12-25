const websiteService = require("../services/website.service.js");
const emailService = require("../services/email.service.js");
const stockProductsService = require("../services/stock_products.service.js");
const cron = require("node-cron");
const STOCK_PRODUCT_URL =
  process.env.STOCK_PRODUCT_URL ||
  "https://www.pccomponentes.com/buscar/?query=rtx+3080";
const STOCK_PRODUCT_NAME = process.env.STOCK_PRODUCT_NAME || "RTX_3080";
const PC_COMPONENTES = "PC_COMPONENTES";

// Schedule tasks to be run on the server.
exports.execute = async function execute(cronTime) {
  cron.schedule(cronTime, async function () {
    const availableProducts = await websiteService.getPage(STOCK_PRODUCT_URL);
    console.log("Búsqueda de stock de " + STOCK_PRODUCT_NAME + " ::START");
    if (availableProducts.length > 0) {
      const stockProducts = parseStockProducts(availableProducts);
      // Retrieve old avaiable products
      const lastAvailableProducts = await stockProductsService.findByWebsiteNameAndProductSearching(
        PC_COMPONENTES,
        STOCK_PRODUCT_NAME
      );
      if (
        lastAvailableProducts.length === 0 ||
        (lastAvailableProducts.length > 0 &&
          stockProducts.toString() !== lastAvailableProducts.toString())
      ) {
        console.log(
          "Los productos disponibles son: " + JSON.stringify(availableProducts)
        );
        await emailService.send_email(availableProducts);
        stockProductsService.save(stockProducts);
      }
    } else {
      console.log("No hay productos disponibles");
    }
    console.log("Búsqueda de stock de " + STOCK_PRODUCT_NAME + " ::END");
  });
};

function hasStockProductsChanged(lastAvailableProducts, availableProducts) {}

function parseStockProducts(availableProducts) {
  return availableProducts.map((availableProducts) => {
    return {
      website_name: PC_COMPONENTES,
      product_searching: RTX_3080,
      product_name: availableProducts.title,
      product_price: availableProducts.price,
      url: availableProducts.url,
    };
  });
}

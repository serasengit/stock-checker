const websiteService = require("../services/website.service.js");
const stockSearchingService = require("../services/stock_searching.service.js");
const emailService = require("../services/email.service.js");
const stockProductsService = require("../services/stock_product.service.js");
const cron = require("node-cron");

// Schedule tasks to be run on the server.
exports.execute = async function execute() {
  const stockSearchings = await stockSearchingService.findAll();

  for (const stockSearching of stockSearchings) {
    try {
      if (stockSearching.is_active) {
        console.log(
          "Init cron:: " +
            stockSearching.website.name +
            " - " +
            stockSearching.product_searching +
            " at: " +
            new Date()
        );
        cron.schedule(stockSearching.cron_pattern, async function () {
          const availableProducts = await websiteService.getPage(
            stockSearching.url,
            stockSearching.website.name
          );
          console.log(
            "Búsqueda de stock de " +
              stockSearching.website.name +
              " - " +
              stockSearching.product_searching +
              " ::START"
          );
          if (availableProducts && availableProducts.length > 0) {
            console.log(
              "Los productos disponibles son: " +
                JSON.stringify(availableProducts)
            );
            const stockProducts = parseStockProducts(
              availableProducts,
              stockSearching.id
            );
            // Retrieve old available products
            const lastAvailableProducts = await stockProductsService.findByProductSearchingId(
              stockSearching.id
            );
            if (
              lastAvailableProducts.length === 0 ||
              (lastAvailableProducts.length > 0 &&
                JSON.stringify(stockProducts) !==
                  JSON.stringify(lastAvailableProducts))
            ) {
              try {
                setIsNotifiedStockProducts(stockProducts, true);
                await stockProductsService.save(stockProducts);
                emailService.sendStockProductsEmail(
                  stockSearching.website.name + " STOCK",
                  stockProducts
                );

                if (stockProducts.length > 0) {
                  const productToOrder = stockProducts[0];
                  const productPrice = Number(
                    productToOrder.product_price
                      .replace(",", ".")
                      .replace("€", "")
                  );
                  if (
                    (!stockSearching.price_limit ||
                      (stockSearching.price_limit &&
                        productPrice <= stockSearching.price_limit)) &&
                    (!stockSearching.product_filter_key ||
                      (stockSearching.product_filter_key &&
                        productToOrder.product_name.includes(
                          stockSearching.product_filter_key
                        )))
                  ) {
                    const orderConfirmation = await websiteService.buyStockProduct(
                      productToOrder.url,
                      stockSearching.website.name
                    );
                    if (orderConfirmation)
                      emailService.sendOrderedProductEmail(
                        productToOrder.product_name + " -  PEDIDO",
                        orderConfirmation
                      );
                  }
                }
              } catch (err) {
                console.log(err);
                setIsNotifiedStockProducts(stockProducts, false);
                stockProductsService.save(stockProducts);
              }
            }
          } else {
            console.log("No hay productos disponibles");
            const noAvailableProducts = getNoAvailableProducts(
              stockSearching.id
            );
            // Retrieve old available products
            const lastAvailableProducts = await stockProductsService.findByProductSearchingId(
              stockSearching.id
            );
            if (
              lastAvailableProducts.length === 0 ||
              (lastAvailableProducts.length > 0 &&
                JSON.stringify(noAvailableProducts) !==
                  JSON.stringify(lastAvailableProducts))
            ) {
              emailService.sendEmail(
                "NO HAY PRODUCTOS DE - " +
                  stockSearching.product_searching +
                  " EN " +
                  stockSearching.website.name,
                null
              );
              setIsNotifiedStockProducts(noAvailableProducts, true);
              stockProductsService.save(noAvailableProducts);
            }
          }
          console.log(
            "Búsqueda de stock de " +
              stockSearching.website.name +
              " - " +
              stockSearching.product_searching +
              " ::END"
          );
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

function setIsNotifiedStockProducts(stockProducts, isNotified) {
  stockProducts.forEach(
    (stockProduct) => (stockProduct.is_notified = isNotified)
  );
}

function parseStockProducts(availableProducts, stockSearchingId) {
  return availableProducts.map((availableProducts) => {
    return {
      product_name: availableProducts.title,
      product_price: availableProducts.price,
      product_searching_id: stockSearchingId,
      url: availableProducts.url,
    };
  });
}

function getNoAvailableProducts(stockSearchingId) {
  return [
    {
      product_name: "NO_PRODUCTS",
      product_price: "0€",
      product_searching_id: stockSearchingId,
      url: "NO_PRODUCTS",
    },
  ];
}

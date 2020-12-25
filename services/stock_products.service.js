const StockProducts = require("../db/models/stock_products");

exports.findByWebsiteNameAndProductSearching = async function findByWebsiteNameAndProductSearching(
  websiteName,
  productSearching
) {
  return StockProducts.query()
    .where("website_name", websiteName)
    .andWhere("product_searching", productSearching);
};

exports.save = async function save(stockProducts) {
  return StockProducts.query().insert(stockProducts);
};

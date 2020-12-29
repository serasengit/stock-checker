const StockProduct = require("../db/models/stock_product");

exports.findByProductSearchingId = async function findByProductSearchingId(
  productSearchingId
) {
  const lastStockProduct = (
    await StockProduct.query()
      .max("created_at")
      .where("product_searching_id", productSearchingId)
      .andWhere("is_notified", true)
      .limit(1)
  )[0];
  return StockProduct.query()
    .where("product_searching_id", productSearchingId)
    .andWhere("is_notified", true)
    .andWhere("created_at", ">=", lastStockProduct.max);
};

exports.save = async function save(stockProducts) {
  return StockProduct.query().insert(stockProducts);
};

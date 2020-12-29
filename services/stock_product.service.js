const StockProduct = require("../db/models/stock_product");

exports.findByProductSearchingId = async function findByProductSearchingId(
  productSearchingId
) {
  const today = new Date();
  return StockProduct.query()
    .where("product_searching_id", productSearchingId)
    .andWhere("is_notified", true)
    .andWhere(
      "created_at",
      ">=",
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours() - 6,
        0,
        0
      )
    );
};

exports.save = async function save(stockProducts) {
  return StockProduct.query().insert(stockProducts);
};

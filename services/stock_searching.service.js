const StockSearching = require("../db/models/stock_searching");

exports.findAll = async function findAll() {
  return StockSearching.query().joinEager("website");
};

exports.save = async function save(stockSearchings) {
  return StockSearching.query().insert(stockSearchings);
};

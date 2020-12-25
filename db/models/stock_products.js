const Knex = require("knex");
const environment = process.env.ENVIRONMENT || "development";
const connection = require("../../knexfile")[environment];
const { Model } = require("objection");
const knexConnection = Knex(connection);
Model.knex(knexConnection);

class StockProducts extends Model {
  static get tableName() {
    return "T0002_STOCK_PRODUCTS";
  }
}
module.exports = StockProducts;

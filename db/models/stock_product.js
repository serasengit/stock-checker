const Knex = require("knex");
const environment = process.env.ENVIRONMENT || "development";
const connection = require("../../knexfile")[environment];
const { Model } = require("objection");
const knexConnection = Knex(connection);
Model.knex(knexConnection);

class StockProduct extends Model {
  static get tableName() {
    return "T0004_STOCK_PRODUCTS";
  }
  static get relationMappings() {
    const StockSearching = require("./stock_searching");

    return {
      stock_searching: {
        relation: Model.BelongsToOneRelation,
        modelClass: StockSearching,
        join: {
          from: "T0004_STOCK_PRODUCTS.product_searching_id",
          to: "T0003_STOCK_SEARCHING.id",
        },
      },
    };
  }
}
module.exports = StockProduct;

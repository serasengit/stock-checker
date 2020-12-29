const Knex = require("knex");
const environment = process.env.ENVIRONMENT || "development";
const connection = require("../../knexfile")[environment];
const { Model } = require("objection");
const knexConnection = Knex(connection);

Model.knex(knexConnection);

class StockSearching extends Model {
  static get tableName() {
    return "T0003_STOCK_SEARCHING";
  }

  static get relationMappings() {
    const Website = require("./website");
    const StockProduct = require("./stock_product");

    return {
      website: {
        relation: Model.BelongsToOneRelation,
        modelClass: Website,
        join: {
          from: "T0003_STOCK_SEARCHING.website_id",
          to: "T0002_WEBSITE.id",
        },
      },
      stock_products: {
        relation: Model.HasManyRelation,
        modelClass: StockProduct,
        join: {
          from: "T0003_STOCK_SEARCHING.id",
          to: "T0004_STOCK_PRODUCTS.product_searching_id",
        },
      },
    };
  }
}
module.exports = StockSearching;

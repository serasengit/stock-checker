const Knex = require("knex");
const environment = process.env.ENVIRONMENT || "development";
const connection = require("../../knexfile")[environment];
const { Model } = require("objection");
const knexConnection = Knex(connection);
Model.knex(knexConnection);

class Website extends Model {
  static get tableName() {
    return "T0002_WEBSITE";
  }
  static get relationMappings() {
    const StockSearching = require("./stock_searching");

    return {
      stock_searchings: {
        relation: Model.HasManyRelation,
        modelClass: StockSearching,
        join: {
          from: "T0002_WEBSITE.id",
          to: "T0003_STOCK_SEARCHING.website_id",
        },
      },
    };
  }
}
module.exports = Website;

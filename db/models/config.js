const Knex = require("knex");
const environment = process.env.ENVIRONMENT || "development";
const connection = require("../../knexfile")[environment];
const { Model } = require("objection");
const knexConnection = Knex(connection);
Model.knex(knexConnection);

class Config extends Model {
  static get tableName() {
    return "T0001_CONFIG";
  }
}
module.exports = Config;

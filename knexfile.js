// Update with your config settings.
const pg = require("pg");
pg.defaults.ssl = true;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = {
  //Delete in Production
  development: {
    client: "pg",
    connection:
      "postgres://ufyewvipnwixut:fc7d9cc077e651b257cb0f0868fb9665f98562368968c7cde30955914001eb3f@ec2-46-137-100-204.eu-west-1.compute.amazonaws.com:5432/d2i4rn6mt6e1af?ssl=true",
    migrations: {
      directory: "db/knex/migrations",
    },
    seeds: {
      directory: "db/knex/seeds",
    },
    ssl: true,
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL_SSL_TRUE,
    migrations: {
      directory: "db/knex/migrations",
    },
    seeds: {
      directory: "db/knex/seeds",
    },
    ssl: true,
  },
};

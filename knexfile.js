// Update with your config settings.
const pg = require('pg')
pg.defaults.ssl = true

module.exports = {
  //Delete in Production
  development: {
    client: 'pg',
    connection: 'postgres://piimsvoaqonvxv:b72567ec1e423469edf0d28f0d5c2dd788aba8b2c6e1b55b1bcff93e1166f0c4@ec2-79-125-4-96.eu-west-1.compute.amazonaws.com:5432/d2ce193kkru3b3?ssl=true',
    migrations: {
      directory: 'db/knex/migrations',
    },
    seeds: {
      directory: 'db/knex/seeds'
    },
    ssl: true
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL_SSL_TRUE,
    migrations: {
      directory: 'db/knex/migrations',
    },
    seeds: {
      directory: 'db/knex/seeds'
    },
    ssl: true
  }

};

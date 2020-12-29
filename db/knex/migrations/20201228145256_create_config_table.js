exports.up = function (knex, Promise) {
  return knex.schema.createTable("T0001_CONFIG", function (table) {
    table.increments();
    table.string("clave").unique();
    table.string("value").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("T0001_CONFIG");
};

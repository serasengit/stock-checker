exports.up = function (knex, Promise) {
  return knex.schema.createTable("T0002_STOCK_PRODUCTS", function (table) {
    table.increments();
    table.string("website_name").notNullable();
    table.string("product_searching").notNullable();
    table.string("product_name").notNullable();
    table.string("product_price").notNullable();
    table.string("url").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique([
      "website_name",
      "product_name",
      "product_searching",
      "product_price",
    ]);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("T0002_STOCK_PRODUCTS");
};

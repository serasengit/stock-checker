exports.up = function (knex, Promise) {
  return knex.schema.createTable("T0004_STOCK_PRODUCTS", function (table) {
    table.increments();
    table
      .integer("product_searching_id")
      .references("id")
      .inTable("T0003_STOCK_SEARCHING")
      .notNull()
      .onDelete("cascade");
    table.string("product_name").notNullable();
    table.string("product_price").notNullable();
    table.string("url").notNullable();
    table.boolean("is_notified").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique([
      "product_searching_id",
      "product_name",
      "product_price",
      "created_at",
    ]);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("T0004_STOCK_PRODUCTS");
};

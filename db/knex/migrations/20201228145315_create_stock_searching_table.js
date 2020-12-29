exports.up = function (knex, Promise) {
  return knex.schema.createTable("T0003_STOCK_SEARCHING", function (table) {
    table.increments();
    table
      .integer("website_id")
      .references("id")
      .inTable("T0002_WEBSITE")
      .notNull()
      .onDelete("cascade");
    table.string("product_searching").notNullable();
    table.string("url").notNullable();
    table.float("price_limit");
    table.string("product_filter_key");
    table.string("cron_pattern").notNullable();
    table.boolean("is_active").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["website_id", "product_searching", "url"]);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("T0003_STOCK_SEARCHING");
};

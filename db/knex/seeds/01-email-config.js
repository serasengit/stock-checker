exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("T0001_CONFIG")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("T0001_CONFIG").insert([
        { id: 1, clave: "email", value: "maserasen@gmail.com" },
        { id: 2, clave: "email_pass", value: "aiocxarqbtcsuzrc" },
      ]);
    });
};

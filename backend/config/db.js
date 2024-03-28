const knex = require("knex");
require("dotenv").config();

const port = parseInt(process.env.DB_PORT) || 5432;

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

module.exports = { db };

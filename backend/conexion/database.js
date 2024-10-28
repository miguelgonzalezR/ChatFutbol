const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatfutbol',
});

module.exports = db;

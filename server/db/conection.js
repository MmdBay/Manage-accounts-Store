"use strict";

/**
 * Import and connect to a SQLite3 database.
 * @module sqlite3
 */

/**
 * The SQLite3 module.
 * @external sqlite3
 * @see {@link https://github.com/mapbox/node-sqlite3|GitHub}
 */

const sqlite = require("sqlite3").verbose();

/**
 * The SQLite3 database object.
 * @typedef {Object} Database
 * @property {function} close - Closes the database connection.
 * @property {function} run - Runs a SQL query.
 * @property {function} get - Runs a SQL query and returns the first row.
 * @property {function} all - Runs a SQL query and returns all rows.
 */

/**
 * The SQLite3 database connection.
 * @type {Database}
 */
const db = new sqlite.Database("./db/customer.db", (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected To DB');
});

// db.run(`ALTER TABLE purchased_products DROP COLUMN recived`)
// db.run(`ALTER TABLE purchased_products ADD COLUMN recived INTEGER`)
// db.run(`UPDATE purchased_products SET  = `)

// // creat new Table users
// db.run(
//   `CREATE TABLE users (
//     id INTEGER PRIMARY KEY,
//     name TEXT, family TEXT,
//     phone TEXT UNIQUE,
//     created_at INTEGER
//        )`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Table created successfully.");
//     }
//   }
// );

// // creat new table products

// db.run(
//   `CREATE TABLE IF NOT EXISTS purchased_products (
//     id INTEGER PRIMARY KEY,
//     product_name,
//     user_id INTEGER,
//     price REAL,
//     created_at TEXT 
//   )`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Created the purchased_products table if not exists.");
//     }
//   }
// );

// db.run(
//   `CREATE TABLE IF NOT EXISTS recived_price (
//     id INTEGER PRIMARY KEY,
//     user_id INTEGER,
//     price REAL,
//     created_at TEXT 
//   )`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Created the purchased_products table if not exists.");
//     }
//   }
// );


// exports db module
module.exports = db;

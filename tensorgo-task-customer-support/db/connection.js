import sqlite from "node:sqlite";
const db = new sqlite.DatabaseSync("db/data.db");

const close = () => {
  db.close();
  console.log("Purging database connection!");
};

export const database = { db, close };

import { database } from "./connection.js";

const db = database.db;

const setupUsers = () => {
  const usersTableSql = ` CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          picture TEXT NOT NULL
      )`;
  db.exec(usersTableSql);
};

const createUser = (name, email, picture) => {
  const insert = db.prepare(
    "INSERT INTO users (name, email, picture) VALUES (?, ?, ?)"
  );

  try {
    insert.run(name, email, picture);
    console.log("User created");

    return true;
  } catch (err) {
    console.log(err);

    console.log("User cannot be created");
  }

  return false;
};

const findUserByEmail = (email) => {
  const find = db.prepare("SELECT * FROM users WHERE email=?");
  const result = find.get(email) ?? null;

  const user = result === null ? null : { ...result };

  return user;
};

const findUserById = (id) => {
  const find = db.prepare("SELECT * FROM users WHERE id=?");
  const result = find.get(id) ?? null;

  const user = result === null ? null : { ...result };

  return user;
};

const updateUser = (name, picture, email) => {
  if (findUserByEmail(email) === null) return false;

  const update = db.prepare("UPDATE users SET name=?, picture=? WHERE email=?");
  const result = update.run(name, picture, email);

  return result?.changes === 1;
};

export const user = {
  setupUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};

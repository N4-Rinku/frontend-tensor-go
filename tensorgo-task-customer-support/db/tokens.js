import { database } from "./connection.js";

const db = database.db;

const setupTokens = () => {
  const tokensTableSql = `CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        accessToken TEXT NOT NULL,
        refreshToken TEXT NOT NULL
    )`;
  db.exec(tokensTableSql);
};

const createToken = (token, jwtTokens = {}) => {
  const insert = db.prepare(
    "INSERT INTO tokens (token, accessToken, refreshToken) VALUES (?, ?, ?)"
  );
  try {
    insert.run(token, jwtTokens.accessToken, jwtTokens.refreshToken);
    console.log("Token saved");

    return true;
  } catch (err) {
    console.log(err);

    console.log("Token cannot be saved");
  }

  return false;
};

const findToken = (token) => {
  const find = db.prepare("SELECT * FROM tokens WHERE token=?");
  const result = find.get(token) ?? null;

  const tokens = result === null ? null : { ...result };

  return tokens;
};

const updateToken = (token, accessToken, refreshToken) => {
  const update = db.prepare(
    "UPDATE tokens SET accessToken=?, refreshToken=? WHERE token=?"
  );
  const result = update.run(accessToken, refreshToken, token);

  return result?.changes === 1;
};

const deleteToken = (token) => {
  const _delete = db.prepare("DELETE FROM tokens WHERE token=?");
  const result = _delete.run(token);

  return result?.changes === 1;
};

export const token = {
  setupTokens,
  createToken,
  findToken,
  updateToken,
  deleteToken,
};

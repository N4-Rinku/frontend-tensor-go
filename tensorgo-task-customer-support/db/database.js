import { database as _database } from "./connection.js";
import { token } from "./tokens.js";
import { user } from "./users.js";

const database = {
  db: _database.db,
  close: _database.close,
  Users: {
    setup: user.setupUsers,
    find: {
      byEmail: user.findUserByEmail,
      byId: user.findUserById,
    },
    create: user.createUser,
    update: user.updateUser,
  },
  Tokens: {
    setup: token.setupTokens,
    find: token.findToken,
    create: token.createToken,
    update: token.updateToken,
    delete: token.deleteToken,
  },
};

export default database;

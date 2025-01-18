import JwtAuth from "../controllers/jwt_auth.js";
import database from "../db/database.js";
import crypto from "crypto";

export const TOKEN = "csrf_token";

function generateRandomToken(length = 32) {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString("base64url");
}

const setupAuth = (userData) => {
  const _userData = {
    name: userData.name,
    email: userData.email,
    picture: userData.picture,
    intercomContactId: userData.intercomId,
  };

  let user = database.Users.find.byEmail(userData.email);
  if (user === null)
    user = database.Users.create(
      userData.name,
      userData.email,
      userData.picture
    );
  else
    user = database.Users.update(
      userData.name,
      userData.picture,
      userData.email
    );

  const token = generateRandomToken();
  const tokenizer = new JwtAuth.JwtTokenizer(_userData);
  const jwtTokens = tokenizer.getTokens();

  const dbSaved = database.Tokens.create(token, jwtTokens);

  return { token, dbSaved };
};

const verifyJwtTokens = (entity) => {
  const user = database.Users.find.byEmail(entity.email);

  return user !== null;
};

export const validateToken = async (token) => {
  const result = { valid: false, userData: null }; // to be returned

  if (token === null) return result;

  const tokenObj = database.Tokens.find(token);

  if (tokenObj === null) return false;

  const jwtValidator = new JwtAuth.JwtValidator(
    tokenObj.accessToken,
    verifyJwtTokens
  );
  await jwtValidator.validate();

  if (jwtValidator.isValidated()) {
    result.valid = true;
    result.userData = jwtValidator.entity();
    return result;
  }

  jwtValidator.token = tokenObj.refreshToken;
  await jwtValidator.validate();

  if (!jwtValidator.isValidated()) return result;
  result.valid = true;

  const userData = database.Users.find.byEmail(jwtValidator.entity().email);

  const newAccessToken = new JwtAuth.JwtTokenizer(userData).createAccessToken();

  database.Tokens.update(token, newAccessToken, refreshToken);

  result.userData = userData;
  return result;
};

const validateAuth = async (req, res, next) => {
  const token = req.cookies[TOKEN] ?? null;
  if (token === null) {
<<<<<<< HEAD
    res.redirect("/landing");
=======
    res.redirect("/");
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
    return;
  }

  const result = await validateToken(token);
  if (
    result.valid === false ||
<<<<<<< HEAD
    result.userData?.intercomContactId === undefined
  ) {
    res.clearCookie(TOKEN);
    res.redirect("/landing");
=======
    result.userData.intercomContactId === undefined
  ) {
    res.clearCookie(TOKEN);
    res.status(403).json({ message: "Invalid Access" });
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
    return;
  }

  delete result.userData.iat;
  delete result.userData.exp;

  req.user = result.userData;
  next();
};

const auth = {
  setup: setupAuth,
  validate: validateAuth,
};

export default auth;

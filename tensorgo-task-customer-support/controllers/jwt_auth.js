import jwt from "jsonwebtoken";
import { TOKEN } from "../constants/auth.js";

const JWT_SECRET_KEY = TOKEN.SECRET;

class JwtTokenizer {
  #accessOptions = {
    expiresIn: TOKEN.EXPIRY.ACCESSTOKEN,
  };
  #refreshOptions = {
    expiresIn: TOKEN.EXPIRY.REFRESHTOKEN,
  };

  constructor(entity, key = "email", accessOptions, refreshOptions) {
    this.entity = entity;
    this.key = key;
    this.#accessOptions = accessOptions ?? this.#accessOptions;
    this.#refreshOptions = refreshOptions ?? this.#refreshOptions;
  }

  getTokens = () => {
    const tokens = {
      accessToken: this.createAccessToken(),
      refreshToken: this.createRefreshToken(),
    };

    return tokens;
  };

  createAccessToken = () => {
    const accessToken = jwt.sign(
      this.entity,
      JWT_SECRET_KEY,
      this.#accessOptions
    );

    return accessToken;
  };

  createRefreshToken = () => {
    const entity = {};
    entity[this.key] = this.entity[this.key];

    const refreshToken = jwt.sign(entity, JWT_SECRET_KEY, this.#refreshOptions);

    return refreshToken;
  };
}

class JwtValidator {
  #validated = false;
  #entity = null;

  constructor(token, verifyFn) {
    this.verifyEntity = verifyFn ?? ((entity) => true);
    this.token = token ?? null;
  }

  validate = async () => {
    let token = this.token;

    if (token === null) return;

    try {
      this.#entity = jwt.verify(token, JWT_SECRET_KEY);

      this.#validated = (await this.verifyEntity(this.#entity)) === true;
    } catch (err) {
      console.log(err);
    }
  };

  isValidated = () => this.#validated;

  entity = () => this.#entity;
}

export const JwtAuth = { JwtTokenizer, JwtValidator };

export default JwtAuth;

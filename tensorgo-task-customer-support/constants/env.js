import dotenv from "dotenv";
dotenv.config();

const INTERCOM = {
  ACCESS_TOKEN: process.env.INTERCOM_ACCESS_TOKEN,
};

const APP = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
};

const URL = `http://${APP.HOST}:${APP.PORT}`;

const OAUTH = {
  GOOGLE: {
    CLIENT: {
      ID: process.env.GOOGLE_CLIENT_ID,
      SECRET: process.env.GOOGLE_CLIENT_SECRET,
      EMAIL: process.env.GOOGLE_EMAIL,
    },
    URL: {
      _: process.env.GOOGLE_OAUTH_URL,
      ACCESS_TOKEN: process.env.GOOGLE_ACCESS_TOKEN_URL,
      TOKEN_INFO: process.env.GOOGLE_TOKEN_INFO_URL,
      CALLBACK: URL + "/google/callback",
    },
    SCOPES: [
      "https%3A//www.googleapis.com/auth/userinfo.email",
      "https%3A//www.googleapis.com/auth/userinfo.profile",
    ],
    STATE: process.env.GOOGLE_OAUTH_STATE,
    GRANT_TYPE: process.env.GOOGLE_OAUTH_GRANT_TYPE,
  },
};

const env = {
  intercom: INTERCOM,
  app: APP,
  url: URL,
  oauth: OAUTH,
};

export default env;

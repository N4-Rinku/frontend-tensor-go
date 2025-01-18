import dotenv from "dotenv";
dotenv.config();

export const TOKEN = {
  SECRET: process.env.JWT_SECRET_KEY,
  EXPIRY: {
    ACCESSTOKEN: 24 * 60 * 60 * 1000, // 1 day
    REFRESHTOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

export const COOKIE = {
  HTTPONLY: true,
  SECURE: true,
  MAXAGE: {
    REFRESH: TOKEN.EXPIRY.REFRESHTOKEN,
    ACCESS: TOKEN.EXPIRY.ACCESSTOKEN,
  },
};

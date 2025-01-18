import express from "express";
import env from "./constants/env.js";
import { AuthorizationRouter } from "./routes/authorization.js";
import { QueryRouter } from "./routes/query.js";
import database from "./db/database.js";
import cookieParser from "cookie-parser";
import auth from "./middlewares/auth.js";
<<<<<<< HEAD
import { join } from "path";
=======
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1

const app = express();
const port = env.app.PORT;

const validate = auth.validate;
<<<<<<< HEAD
export const __dirname = import.meta.dirname;
=======
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1

// global middlewares for cookies and body parsing
app.use(cookieParser());
app.use(express.json());
<<<<<<< HEAD
app.use(express.static("public"));
=======
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1

// routes for auth and queries
app.use("/", AuthorizationRouter);
app.use("/query", validate, QueryRouter);

app.get("/home", validate, (req, res) => {
  res.json({ ...req.user });
});

<<<<<<< HEAD
app.get("/app", validate, (_, res) => {
  res.sendFile(join(__dirname, "public", "dist/index.html"));
});

app.get("/landing", (_, res) => {
  res.sendFile(join(__dirname, "public", "landing.html"));
});

// start the application
const server = app.listen(port, () => {
=======
// start the application
app.listen(port, () => {
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
  console.log("Database connection successful");
  database.Users.setup();
  console.log("Users table (already?) created");
  database.Tokens.setup();
  console.log("Tokens table (already?) created");

  console.log(`Application listening on ${env.url}`);
});

// when exiting the application, can be used to close running things
process.on("SIGINT", () => {
<<<<<<< HEAD
  server.close(); // closing the application server
  console.log("\nApplication server closed");
  database.close();
  console.log("Gracefully exiting the application");
=======
  database.close();
  console.log("Exiting the application");
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
});

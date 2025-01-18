import { Router } from "express";
import env from "../constants/env.js";
import auth, { TOKEN } from "../middlewares/auth.js";
import intercomClient from "../controllers/intercom.js";
import { COOKIE } from "../constants/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  if (req.cookies[TOKEN]) {
<<<<<<< HEAD
    res.redirect("/app");
=======
    res
      .status(400)
      .json({ message: "Cookies are already set, try to log out" });
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
    return;
  }

  const state = env.oauth.GOOGLE.STATE;
  const scopes = env.oauth.GOOGLE.SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${env.oauth.GOOGLE.URL._}?client_id=${env.oauth.GOOGLE.CLIENT.ID}&redirect_uri=${env.oauth.GOOGLE.URL.CALLBACK}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const data = {
    code,
    client_id: env.oauth.GOOGLE.CLIENT.ID,
    client_secret: env.oauth.GOOGLE.CLIENT.SECRET,
    redirect_uri: env.oauth.GOOGLE.URL.CALLBACK,
    grant_type: env.oauth.GOOGLE.GRANT_TYPE,
  };

  // exchange authorization code for access token & id_token
  const response = await fetch(env.oauth.GOOGLE.URL.ACCESS_TOKEN, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const access_token_data = await response.json();
  const { id_token } = access_token_data;

  // verify and extract the information in the id token
  const token_info_response = await fetch(
    `${env.oauth.GOOGLE.URL.TOKEN_INFO}?id_token=${id_token}`
  );

  const userData = await token_info_response.json();

  if (token_info_response.status !== 200) {
    res.status(403).json({ message: "Google did not verify you" });
    return;
  }

  // seach and create contact on intercom
  const intercomContact = (
    await intercomClient.contacts.search({
      query: { field: "email", value: userData.email, operator: "=" },
    })
  ).data;

  if (intercomContact.length === 0) {
    const newContact = await intercomClient.contacts.create({
      email: userData.email,
      name: userData.name,
    });

    userData.intercomId = newContact.id;
  } else {
    userData.intercomId = intercomContact[0].id;
  }

  // setup cookies
  const result = auth.setup(userData, res);

  if (result.dbSaved === true) {
    res.cookie(TOKEN, result.token, {
      httpOnly: COOKIE.HTTPONLY,
      maxAge: COOKIE.MAXAGE.REFRESH,
    });

<<<<<<< HEAD
    res.redirect("/app");
=======
    res.status(200).json({ message: "Logged in successfully" });
>>>>>>> 6c4a28f6238a723148ed9b424f36270887aba5c1
  } else res.status(500).json({ message: "Couldn't get you logged in!" });
});

export const AuthorizationRouter = router;

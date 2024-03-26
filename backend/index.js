const express = require("express");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
const port = 3000;

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000",
      apiKey: "540A0AF3E7EB2DEFE540ED7CBEAEA973",
    },
    (identifier, profile, done) => {
      // console.log(identifier, profile, done);
      done(profile);
    }
  )
);

app.get("/auth/steam", (req, res) => {
  res.redirect("/");
});

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", {
    failureRedirect: "/login",
    successRedirect: "https://localhost:3005/",
  }),
  (req, res) => {
    console.log("11111");
    res.redirect("https://localhost:3005/");
  }
);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

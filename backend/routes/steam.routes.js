const passport = require("passport");
const steam = require("express").Router();

steam.get(
  "/auth/steam",
  (req, res, next) => {
    const { id } = req.query;
    // console.log(id);
    req.user = { id };
    console.log(req);
    next();
  },
  passport.authenticate("steam")
);
steam.get(
  "/auth/steam/return",
  passport.authenticate("steam", {
    failureRedirect: "https://localhost:3005/steam-login-failed",
  }),
  (req, res) => {
    // console.log(req.user);
    res.redirect("https://localhost:3005/steam-login");
  }
);

steam.get("/allgames");

module.exports = steam;

const passport = require("passport");
const steam = require("express").Router();

steam.get("/auth/steam", passport.authenticate("steam"));
steam.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  (req, res) => {
    
    res.redirect("https://localhost:3005/steamlogin");
  }
);

steam.get("/allgames");

module.exports = steam;

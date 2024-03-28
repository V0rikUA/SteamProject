const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const { STEAM_API_KEY, BACKEND_URL } = process.env;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: `${BACKEND_URL}auth/steam/return`,
      realm: BACKEND_URL,
      apiKey: STEAM_API_KEY,
    },
    function (identifier, profile, done) {
      return done(null, { profile, jwt: "jwt" });
    }
  )
);

module.exports = passport.initialize();

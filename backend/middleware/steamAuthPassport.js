const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const { STEAM_API_KEY, BACKEND_URL } = process.env;

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: `${BACKEND_URL}auth/steam/return`,
      realm: BACKEND_URL,
      apiKey: STEAM_API_KEY,
      passReqToCallback: true,
    },

    function (req, identifier, profile, done) {
      console.log(req);
      return done(null, { profile });
    }
  )
);

module.exports = passport.initialize();

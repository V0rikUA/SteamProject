const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  __addNewUserBySteam,
  __addNewUserByEmail,
  __getUserData,
} = require("../models/user.moddels");
const ValidationError = require("../utils/validationError");
const ConflictError = require("../utils/conflictError");
const steamApi = require("../utils/SteamAPI");

const { JWT_SECRET, NODE_ENV, FRONTEND_URL } = process.env;

const createToken = (userID) => {
  return jwt.sign(
    { id: userID },
    NODE_ENV === "poduction" ? JWT_SECRET : "dev-secret",
    { expiresIn: "7d" }
  );
};

const logInWithSteam = (req, res, next) => {
  const { steamid, personaname } = req.user.profile["_json"];
  __addNewUserBySteam({ steam_id: steamid, name: personaname });
  res.redirect(FRONTEND_URL);
};

const createNewUser = (req, res, next) => {
  const { password, email } = req.body;
  email.toLowerCase();
  const tempUserName = email.split("@")[0];
  if (!password) {
    next(new ValidationError("Missing password field"));
  }
  bcrypt.hash(password, 10).then((hash) => {
    __addNewUserByEmail({
      password_hash: hash,
      email,
      name: tempUserName,
    })
      .then((user) => {
        user.token = createToken(user.id);
        res.status(200).json(user).redirect(FRONTEND_URL);
      })
      .catch((err) => {
        if (err.code === "23505")
          next(new ConflictError("This email is alredy registered"));
      });
  });
};

const getUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    let userProfile = await __getUserData({ id });
    if (userProfile.connected)
      userProfile = {
        ...userProfile,
        ...(await steamApi.getUserProfile(userProfile.steamID)),
      };
    res.status(200).json(userProfile);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { logInWithSteam, createNewUser, getUser };

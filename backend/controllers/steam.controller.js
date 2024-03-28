const {
  __getUserData,
  __addSteamData,
  __checkIfRegisteredWithSteam,
} = require("../models/user.moddels");
const steamApi = require("../utils/SteamAPI");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, NODE_ENV, FRONTEND_URL } = process.env;

const createToken = (userID) => {
  return jwt.sign(
    { id: userID },
    NODE_ENV === "poduction" ? JWT_SECRET : "dev-secret",
    { expiresIn: "7d" }
  );
};

const logInWithSteam = async (req, res) => {
  const steamProfile = req.user.profile._json;

  try {
    if (!__checkIfRegisteredWithSteam(steamProfile.steamid)) {
      __addSteamData({ steam_id: steamProfile.steamid });
    }
    const userProfile = {
      name: steamProfile.personaname,
      steamID: steamProfile.steamid,
      url: steamProfile.profileurl,
      avatar: steamProfile.avatarfull,
      region: steamProfile.loccountrycode,
    };
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllGames = async (req, res, next) => {
  try {
    const gameList = await steamApi.getAllGamesTitle();
    res.status(200).json(gameList);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getGameData = async (res, req, next) => {
  const { gameID } = req.query;
  try {
    const gameData = await steamApi.getGameData(gameID);
    res.status(200).json(gameData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSteamProfile = async (req, res, next) => {
  const { id } = req.query;
  try {
    const { steamID } = await __getUserData({ id });
    const steamProfile = await steamApi.getUserProfile(steamID.toString());
    res.send(200).json(steamProfile);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getWishlist = async (req, res, next) => {
  const { id } = req.query;
  try {
    const { steamID } = await __getUserData({ id });
    const wishlist = await steamApi.getWishlist(steamID);
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getMostPlayedGames = async (req, res, next) => {
  try {
    const mostPlayedGames = await steamApi.getMostPlayedGames();
    res.status(200).json(mostPlayedGames);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getMostPlayedGames,
  getWishlist,
  getSteamProfile,
  getGameData,
  getAllGames,
  logInWithSteam,
};

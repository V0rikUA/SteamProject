const { db } = require("../config/db");

const __addNewUserByEmail = ({ email, password_hash, name }) => {
  return db("users")
    .insert({
      email,
      password_hash,
    })
    .returning(["id", "name"])
    .then((data) => data[0]);
};

const __addNewUserBySteam = ({ steam_id, name }) => {
  return db("users")
    .insert({ steam_id, steam_connected: true })
    .returning(["id"]);
};

const __addSteamData = ({ steam_id, wishlist, game_list }) => {
  return db("users").insert({ steam_id, wishlist, game_list });
};

const __getUserData = ({ id }) => {
  return db("users")
    .select("*")
    .where({ id })
    .then((data) => data[0])
    .then((user) => {
      return {
        name: user.name,
        steamID: user.steam_connected ? user.steam_id : "",
        connected: user.steam_connected,
      };
    });
};

const __checkIfRegistered = (steamID) => {
  return db("users")
    .select("*")
    .where({ steam_id: steamID })
    .then((res) => {
      if (res.length === 0) return res;
      return {};
    });
};

// const __updateWishList = { appid };

module.exports = {
  __addNewUserByEmail,
  __addNewUserBySteam,
  __addSteamData,
  __getUserData,
};

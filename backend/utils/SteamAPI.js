class SteamAPI {
  constructor(apiKey) {
    this._apiKey = apiKey;
  }

  _checkResponce = (res) =>
    res.ok ? res.json() : Promise.reject(res.statusText);

  _fetch = ({ path, options, method }) => {
    return fetch(`http://api.steampowered.com/${path}?${options}`, {
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(this._checkResponce);
  };

  /**
   *
   * @param {String} steamID can be accsepted only string because id can be not fited in Number
   * @returns Profile object
   */
  getUserProfile = (steamID) => {
    if (steamID !== typeof String)
      Promise.reject("@param {steamID} should be type of string");
    const request = {
      path: "ISteamUser/GetPlayerSummaries/v0002/",
      options: `key=${this._apiKey}&steamids=${steamID}`,
      method: "GET",
    };
    return this._fetch(request)
      .then((res) => res.response.players[0])
      .then((profile) => {
        console.log(profile);
        return {
          name: profile.personaname,
          steamID: profile.steamid,
          url: profile.profileurl,
          avatar: profile.avatarfull,
          region: profile.loccountrycode,
        };
      });
  };

  getMostPlayedGames = () => {
    const request = {
      path: "ISteamChartsService/GetMostPlayedGames/v1/",
      options: `key=${this._apiKey}`,
      method: "GET",
    };

    return this._fetch(request).then((res) => res.response.ranks);
  };

  getGameData = (appid) => {
    return fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
      .then(this._checkResponce)
      .then((data) => data[`${appid}`].data)
      .then((title) => {
        const isReleased = !title.release_date.coming_soon;
        const gameInfo = {
          name: title.name,
          cover: title.header_image,
          description: title.detailed_description,
          price: isReleased ? title.price_overview.final_formatted : "TBA",
          url: `https://store.steampowered.com/app/${appid}`,
          releaseDate: title.release_date.date,
          screenShot: [],
          genre: [],
        };
        title["screenshots"].map((item) => {
          gameInfo.screenShot.push(item.path_full);
        });
        title["genres"].map((item) => {
          gameInfo.genre.push(item.description);
        });

        return gameInfo;
      });
  };

  /**
   *
   * @param {String} steamID can be accsepted only string because id can be not fited in Number
   * @returns {Promise} Promise that resolves with wishlist array
   */
  getWishlist = (steamID) => {
    return fetch(
      `https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
      .then(this._checkResponce)
      .then((data) => {
        const wishlist = [];
        for (const key in data) {
          const title = data[key];
          wishlist.push({
            appid: key,
            name: title.name,
            cover: title.capsule,
          });
        }
        return wishlist;
      });
  };

  /**
   *
   * @returns {Promise} Object that contains array of all steam library games
   */
  getAllGamesTitle = () => {
    const request = {
      path: "ISteamApps/GetAppList/v0002/",
      options: `key=${this._apiKey}&format=json`,
      method: "GET",
    };

    return this._fetch(request).then((data) => data.applist.apps);
  };
}

const { STEAM_API_KEY } = process.env;

const steamApi = new SteamAPI(STEAM_API_KEY);
module.exports = steamApi;

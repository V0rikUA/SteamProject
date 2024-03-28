const express = require("express");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const steamAuthPassport = require("./middleware/steamAuthPassport");
const steam = require("./routes/steam.routes");

const app = express();
const { SESSION_SECRET, PORT = 3000 } = process.env;

app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// @ts-ignore
app.use(helmet());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.session());
app.use(steamAuthPassport);

app.use(steam);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

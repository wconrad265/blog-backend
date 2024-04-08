require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

const POSTGRES_URI = process.env.POSTGRES_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  POSTGRES_URI,
};

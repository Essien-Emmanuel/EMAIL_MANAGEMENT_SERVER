const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  app: {
    port: process.env.PORT,
    salt: process.env.SALT_ROUNDS
  },
  database: {
    uri: process.env.DB_URL
  }
}
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  app: {
    port: process.env.PORT
  },
  database: {
    uri: process.env.DB_URL
  }
}
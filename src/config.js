const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  app: {
    port: +process.env.PORT,
    env: process.env.APP_ENV.trim(),
    salt: +process.env.SALT_ROUNDS,
    secret: process.env.USER_JWT_SECRET.trim()
  },
  database: {
    uri: process.env.DB_URL.trim()
  }
}
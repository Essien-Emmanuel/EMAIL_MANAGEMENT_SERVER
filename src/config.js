const dotenv = require('dotenv');

dotenv.config();
const  dbUri = !['production', 'test'].includes(process.env.APP_ENV.trim())? process.env.DB_URL: process.env.ONLINE_DB_URI;

module.exports = {
  app: {
    port: +process.env.PORT,
    env: process.env.APP_ENV.trim(),
    salt: +process.env.SALT_ROUNDS,
    secret: process.env.USER_JWT_SECRET.trim()
  },
  database: {
    uri: dbUri.trim()
  },
  mail: {
    mailTrapToken: process.env.MAILTRAP_TOKEN,
    mailTrapEndpoint: process.env.MAILTRAP_ENDPOINT
  }
}
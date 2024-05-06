const bcrypt = require('bcryptjs');
const Config = require('../config');

const { salt } = Config.app;

exports.hashString = (string) => {
  return bcrypt.hash(string, salt)
}
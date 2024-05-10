const mongoose = require('mongoose');
const Config = require('../config');

const { uri } = Config.database;

class Database {
  constructor() {
    return this.connectToDb()
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance
  }

  async connectToDb() {
    try {
      const dbConnection = await mongoose.connect(uri)
      if (dbConnection) console.log('- Connected to Mongodb server Successfully!🎉');
      return mongoose.connection;
    } catch (error) {
      console.log(error)
      process.exit(-1)
    }
  }
}

module.exports = Database;
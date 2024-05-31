const mongoose = require('mongoose');
const Config = require('../config');
const { MongdbError } = require('../libs/exceptions');

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
      switch (error.name) {
        case "MongoParseError":
          throw new MongdbError("mongodb+srv URI cannot have port number");      
          default:
          throw new MongdbError();
      }
    }
  }
}

exports.Database = Database;
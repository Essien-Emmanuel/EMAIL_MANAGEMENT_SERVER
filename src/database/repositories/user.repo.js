const User = require('../models/User');

class UserRepo {
  static getById(id) {
    return User.findById(id);
  }

  static getByEmail(email) {
    return User.findOne({ email});
  }

  static create(userData) {
    return User.create(userData)
  }

  static update(filter, updateData) {
    return User.updateOne(filter, updateData);
  }

  static delete(id) {
    return User.deleteOne({ id })
  }
}

module.exports = UserRepo;
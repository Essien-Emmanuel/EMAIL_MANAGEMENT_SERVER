const User = require('../models/User');
const { GenericRepo } = require('./generic/index');

class UserRepo extends GenericRepo {
  constructor() {
    super(User);
  }

  getByEmail(email) {
    return this.model.findOne({ email});
  }

}

exports.User = new UserRepo();
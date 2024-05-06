const User = require('../../database/repositories/user.repo');

class AuthService {
  static async createUser(userDto) {
    const user = await User.getByEmail(userDto.email);
    if (user) throw new Error('User Already Exist!');

    const newUser = await User.create(userDto);
    if (!newUser) throw new Error('Unable to create user');

    return newUser;
  }

  static async getUser(id) {
    const user = await User.getById(id);
    if (!user) throw new Error('User Not Found!');

    return user
  }
}

module.exports = AuthService;
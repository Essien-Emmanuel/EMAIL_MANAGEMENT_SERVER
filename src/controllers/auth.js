const intiateSignup = require('../services/auth/initiateSignup');

class AuthController {
  static signup(req, res) {
    console.log('here')
    const { email, password } = req.body;
    intiateSignup({ email, password})
    res.json({
      message: 'success'
    })
  }
}

module.exports = AuthController;
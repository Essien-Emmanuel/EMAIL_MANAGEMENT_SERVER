const intiateSignup = require('../services/auth/initiateSignup');

class AuthController {
  static async signup(req, res) {
    const { email, password } = req.body;
    const response = await intiateSignup({ email, password})
    // res.json({
    //   message: 'success',
    //   data: {...response.data}
    // })
  }
}

module.exports = AuthController;
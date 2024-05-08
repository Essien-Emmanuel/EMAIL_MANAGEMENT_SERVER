const express = require('express');
const defineController = require('../core/defineController');
const initiateSignup  = require('../services/auth/initiateSignup');

const router = express.Router();

router.post('/signup', defineController({
  async controller(req) {
    const { email, password } = req.body
    const response = await initiateSignup({ email, password });
    req.return(response)
  }
}));

module.exports = router;
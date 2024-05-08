const express = require('express');
const defineController = require('../core/defineController');
const initiateSignup  = require('../services/auth/initiateSignup');
const completeSignup = require('../services/auth/completeSignup');
const login = require('../services/auth/login');

const router = express.Router();

router.post('/signup', defineController({
  async controller(req) {
    const { email, password } = req.body
    const response = await initiateSignup({ email, password });
    req.return(response)
  }
}));

router.put('/email/verify', defineController({
  async controller(req) {
    const otpToken = req.query.token;
    const response = await completeSignup({ email: req.body.email, otpToken});
    req.return(response);
  }
}));

router.post('/login', defineController({
  async controller(req) {
    const response = await login({ email: req.body.email, password: req.body.password});
    req.return(response);
  }
}))

module.exports = router;
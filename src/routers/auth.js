const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();
const { signup } = AuthController;

router.post('/signup', signup);

module.exports = router;
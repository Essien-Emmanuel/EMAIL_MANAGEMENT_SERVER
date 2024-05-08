const router = require('express').Router()
const authRoutes = require('./auth');


router.use('/user/auth', authRoutes);

module.exports = router;
const router = require('express').Router()
const authRoutes = require('./auth');


router.use('/auth/user', authRoutes);

module.exports = router;
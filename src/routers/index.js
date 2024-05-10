const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');


router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes)

module.exports = router;
const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { mailServiceProviderRoutes } = require('./mailServiceProvider');


router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', mailServiceProviderRoutes);

module.exports = router;
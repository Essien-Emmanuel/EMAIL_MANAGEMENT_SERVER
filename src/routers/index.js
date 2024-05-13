const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { mailServiceProviderRoutes } = require('./mailServiceProvider');
const { mailTrapCredentialRoutes } = require('./mailTrapCredential');

router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', mailServiceProviderRoutes);
router.use('/credential/mailtrap', mailTrapCredentialRoutes);

module.exports = router;
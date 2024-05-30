const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { serviceProviderRoutes } = require('./serviceProvider')
const { providerConfigRoutes } = require('./providerConfig');
const { mailerRoutes } = require('./mailer');
const { emailTagRoutes } = require('./emailTag');
const { emailRecipientRoutes } = require('./emailRecipient');


router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', serviceProviderRoutes);
router.use('/provider/config', providerConfigRoutes);
router.use('/user/mail', mailerRoutes);
router.use('/user/tag', emailTagRoutes);
router.use('/user/recipient', emailRecipientRoutes);

module.exports = router;
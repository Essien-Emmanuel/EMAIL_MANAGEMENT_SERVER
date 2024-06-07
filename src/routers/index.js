const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { serviceProviderRoutes } = require('./serviceProvider')
const { providerConfigRoutes } = require('./providerConfig');
const { mailerRoutes } = require('./mailer');
const { tagRoutes } = require('./tag');
const { emailRecipientRoutes } = require('./recipient');


router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', serviceProviderRoutes);
router.use('/provider/config', providerConfigRoutes);
router.use('/user/mail', mailerRoutes);
router.use('/user/tag', tagRoutes);
router.use('/user/recipient', emailRecipientRoutes);

module.exports = router;
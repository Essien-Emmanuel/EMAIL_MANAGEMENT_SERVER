const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { serviceProviderRoutes } = require('./serviceProvider')
const { providerConfigRoutes } = require('./providerConfig');
const { mailerRoutes } = require('./mailer');
const { tagRoutes } = require('./tag');
const { emailRecipientRoutes } = require('./recipient');
const { recipient2Routes } = require('./recipient2');
const { subsciberRoutes } = require('./subscriber');
const { broadcastRoutes } = require('./broadcast');

router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', serviceProviderRoutes);
router.use('/provider/config', providerConfigRoutes);
router.use('/user/mail', mailerRoutes);
router.use('/user/tag', tagRoutes);
router.use('/user/recipient', emailRecipientRoutes);
router.use('/user/recipient2', recipient2Routes);
router.use('/user/subscriber', subsciberRoutes);
router.use('/user/broadcast', broadcastRoutes);

module.exports = router;
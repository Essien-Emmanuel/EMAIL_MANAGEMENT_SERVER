const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { serviceProviderRoutes } = require('./serviceProvider')
const { providerConfigRoutes } = require('./providerConfig');
const { mailerRoutes } = require('./mailer');
const { recipientRoutes } = require('./recipient');
const { subsciberRoutes } = require('./subscriber');
const { broadcastRoutes } = require('./broadcast');
const { listRoutes } = require('./list');

router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', serviceProviderRoutes);
router.use('/provider/config', providerConfigRoutes);
router.use('/user/mail', mailerRoutes);
router.use('/user/recipient2', recipientRoutes);
router.use('/user/subscriber', subsciberRoutes);
router.use('/user/broadcast', broadcastRoutes);
router.use('/user/lists', listRoutes);

module.exports = router;
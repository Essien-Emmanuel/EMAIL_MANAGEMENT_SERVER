const router = require('express').Router()
const authRoutes = require('./auth');
const { router: templateRoutes } = require('./template');
const { serviceProviderRoutes } = require('./serviceProvider')
const { mailTrapCredentialRoutes } = require('./mailTrapCredential');
const {mailjetConfigurationRoutes}  = require('./mailjet');
const { providerConfigRoutes } = require('./providerConfig');
const { mailRoutes } = require('./mail');
const { mailerRoutes } = require('./mailer');

router.use('/user/auth', authRoutes);
router.use('/user/template', templateRoutes);
router.use('/mail-service-provider', serviceProviderRoutes);
router.use('/configuration/mailtrap', mailTrapCredentialRoutes);
router.use('/configuration/mailjet', mailjetConfigurationRoutes)
router.use('/provider/config', providerConfigRoutes);
router.use('/user', mailRoutes);
router.use('/user/mail', mailerRoutes);


module.exports = router;
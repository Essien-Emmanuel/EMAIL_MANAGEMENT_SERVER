const { MailjetService } = require('../services/user/mailjet.service');
const { GenericConfigRoutes } = require('./generic/configuration');
// console.log('mail jet service ', MailjetService)

const mailjetConfigRoutes = new GenericConfigRoutes(MailjetService);

exports.mailjetConfigurationRoutes = mailjetConfigRoutes.getRouter();
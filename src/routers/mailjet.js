const { MailjetService } = require('../services/user/mailjet.service');
const { GenericConfigRoutes } = require('./generic/configuration');

const mailjetConfigRoutes = new GenericConfigRoutes(MailjetService);

module.exports = mailjetConfigRoutes.getRouter();
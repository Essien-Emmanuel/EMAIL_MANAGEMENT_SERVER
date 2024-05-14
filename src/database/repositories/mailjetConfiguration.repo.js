const { GeneralConfigRepo } = require('./generic/configuration.repo');
const { MailjetConfigurationModel } = require('../models/MailjetConfiguration')

const mailjetConfiguration = new GeneralConfigRepo(MailjetConfigurationModel);

exports.MailjetConfiguration = mailjetConfiguration;
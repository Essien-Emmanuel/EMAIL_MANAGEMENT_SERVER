const { GenericConfigService } = require('../generics/configuration');
const { MailjetConfiguration } = require('../../database/repositories/mailjetConfiguration.repo');
const { IMailjetConfiguration } = require('../../database/models/MailjetConfiguration');

const MailjetService = new GenericConfigService(MailjetConfiguration, IMailjetConfiguration, 'Mailjet');

exports.MailjetService = MailjetService;

const { GenericMailService } = require('../generics/mail');
const { MailjetConfiguration } = require('../../database/repositories/mailjetConfiguration.repo');

const configVariables = ['apiKey', 'apiSecret'];

const MailjetMailService = new GenericMailService(configVariables, MailjetConfiguration, 'Mailjet');

exports.MailjetMailService = MailjetMailService;
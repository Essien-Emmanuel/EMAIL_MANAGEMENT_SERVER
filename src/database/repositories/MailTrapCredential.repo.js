const MailTrapCredential = require('../models/MailTrapCredential');
const { GenericRepo } = require('./generic/index');

const MailTrapCredentialRepo = new GenericRepo(MailTrapCredential);

module.exports = MailTrapCredentialRepo;
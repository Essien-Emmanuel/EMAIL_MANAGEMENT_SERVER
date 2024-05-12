const { MailTrapCredential } = require('../models/MailTrapCredential');
const { GenericRepo } = require('./generic/index');

// class MailTrapCredentailRepo extends GenericRepo {
//   constructor(model) {
//     super(model);
//   }
//   get
// }

const MailTrapCredentialRepo = new GenericRepo(MailTrapCredential);

exports.MailTrapCredential = MailTrapCredentialRepo;
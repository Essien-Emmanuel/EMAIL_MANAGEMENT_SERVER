const { MailTrapCredential } = require('../models/MailTrapCredential');
const { GenericRepo } = require('./generic/index');

class MailTrapCredentailRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }
  getbyUserIdAndServiceProvider({userId, serviceProviderId}) {
    return this.model.findOne({ user: userId, mailServiceProvider: serviceProviderId})
  }
}

const mailTrapCredential = new MailTrapCredentailRepo(MailTrapCredential)

exports.MailTrapCredential = mailTrapCredential;
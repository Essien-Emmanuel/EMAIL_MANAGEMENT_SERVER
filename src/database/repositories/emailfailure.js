const { EmailFailureModel } = require('../models/EmailFailure');
const { GenericRepo } = require('./generic/index');

class EmailFailureRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }
}

const EmailFailure = new EmailFailureRepo(EmailFailureModel);

exports.EmailFailure = EmailFailure;
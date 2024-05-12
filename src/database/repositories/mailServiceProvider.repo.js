const { MailServiceProviderModel } = require('../models/MailServiceProvider');
const { GenericRepo } = require('./generic/index');

class MailServiceProviderRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }

  getByName(name) {
    return this.model.findOne({ name });
  }

  getBySlug(slug) {
    return this.model.findOne({ slug });
  }
}

const MailServiceProvider = new MailServiceProviderRepo(MailServiceProviderModel);

exports.MailServiceProvider = MailServiceProvider;
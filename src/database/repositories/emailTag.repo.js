const { GenericRepo } = require('./generic/index');
const { EmailTagModel } = require('../models/EmailTags');

class EmailTagRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }
  getById(_id) {
    return this.model.findById(_id).populate('user').exec()
  }

  getBySlug(slug) {
    return this.model.findOne({slug})
  }
}

exports.EmailTag = new EmailTagRepo(EmailTagModel);
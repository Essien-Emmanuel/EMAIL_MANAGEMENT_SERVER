const { Template } = require('../models/Template');
const { GenericRepo } = require('./generic/index');

class TemplateRepo extends GenericRepo {
  constructor() {
    super(Template)
  }
  getById(_id) {
    return this.model.findById(_id).populate('user').exec()
  }

  getBySlug(slug) {
    return this.model.findOne({slug})
  }
}

exports.Template = new TemplateRepo();
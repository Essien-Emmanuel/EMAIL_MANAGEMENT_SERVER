const Template = require('../models/Template');
const { GenericRepo } = require('./generic/index');

class TemplateRepo extends GenericRepo {
  constructor() {
    super(Template)
  }

  getBySlug(slug) {
    return this.model.findOne({slug})
  }
}

exports.Template = new TemplateRepo();
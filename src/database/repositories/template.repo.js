const { Template } = require('../models/Template');
const { GenericRepo } = require('./generic/index');

class TemplateRepo extends GenericRepo {
  constructor() {
    super(Template)
  }
  getById(_id) {
    return this.model.findById(_id).populate('user').exec()
  }

  getByNameAndContent({ name, textContent}) {
    return this.model.findOne({ name, text_content: textContent})
  }
}

exports.Template = new TemplateRepo();
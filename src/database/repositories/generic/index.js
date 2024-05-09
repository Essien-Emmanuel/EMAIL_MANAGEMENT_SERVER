class GenericRepo {
  constructor(model) {
    this.model = model;
  }

  getById(id) {
    return this.model.findById(id);
  }

  create(modelData) {
    return this.model.create(modelData);
  }

  update(filter, updateData) {
    return this.model.updateOne(filter, updateData);
  }

  delete(id) {
    return this.model.deleteOne({id});
  }
}

exports.GenericRepo = GenericRepo;
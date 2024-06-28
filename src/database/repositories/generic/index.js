class GenericRepo {
  constructor(model) {
    this.model = model;
  }

  getById(_id) {
    return this.model.findById(_id);
  }

  getAll(filter) {
    return this.model.find(filter); 
  }

  create(payload) {
    return this.model.create(payload);
  }

  async update(filter, updateData) {
    return this.model.updateOne(filter, updateData);
  }

  async delete(_id) {
    return this.model.deleteOne({_id});
  }
}

exports.GenericRepo = GenericRepo;
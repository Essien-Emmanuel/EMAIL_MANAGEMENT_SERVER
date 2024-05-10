class GenericRepo {
  constructor(model) {
    this.model = model;
  }

  getById(_id) {
    return this.model.findById(_id);
  }

  create(modelData) {
    return this.model.create(modelData);
  }

  async update(filter, updateData) {
    return this.model.updateOne(filter, updateData);
  }

  async delete(_id) {
    console.log('here')
    console.log('id d',  _id)
    console.log('here1')
    return this.model.deleteOne({_id});
  }
}

exports.GenericRepo = GenericRepo;
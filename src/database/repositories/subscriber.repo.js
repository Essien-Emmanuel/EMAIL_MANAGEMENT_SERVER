const { SubsciberModel } = require('../models/Subscriber');
const { GenericRepo } = require('./generic/index');

class SubscriberRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }

  getByEmail(email) {
    return this.model.findOne({ email });
  }

  getAll(filter = {}) {
    return this.model.find(filter)
  }
}

const Subscriber = new SubscriberRepo(SubsciberModel);
exports.Subscriber = Subscriber;
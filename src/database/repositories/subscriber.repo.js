const { SubsciberModel } = require('../models/Subscriber');
const { GenericRepo } = require('./generic/index');

class SubscriberRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }
}

const Subscriber = new SubscriberRepo(SubsciberModel);
exports.Subscriber = Subscriber;
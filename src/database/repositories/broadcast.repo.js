const { BroadcastModel } = require('../models/Broadcast');
const { GenericRepo } = require('./generic/index');

class BroadcastRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }
}

const Broadcast = new BroadcastRepo(BroadcastModel);
exports.Broadcast = Broadcast;
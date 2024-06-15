const { BroadcastFailureModel } = require('../models/BroadcastFailure');
const { GenericRepo } = require('./generic/index');

class BroadcastFailureRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }
}

const Broadcast = new BroadcastFailureRepo(BroadcastFailureModel);

exports.Broadcast = Broadcast;
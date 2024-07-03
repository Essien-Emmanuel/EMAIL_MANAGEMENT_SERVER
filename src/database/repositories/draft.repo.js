const { DraftModel } = require("../models/Draft");
const { GenericRepo } = require("./generic/index");

class BroadcastRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }

  getByFilter(filter) {
    return this.model.findOne(filter);
  }
}

const Draft = new BroadcastRepo(DraftModel);
exports.Draft = Draft;

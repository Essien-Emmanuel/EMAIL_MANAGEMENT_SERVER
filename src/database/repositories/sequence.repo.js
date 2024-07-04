const { SequenceModel } = require("../models/Sequence");
const { GenericRepo } = require("./generic/index");

class SequenceRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }
}

const Sequence = new SequenceRepo(SequenceModel);

exports.Sequence = Sequence;

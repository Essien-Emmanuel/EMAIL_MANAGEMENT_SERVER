const { recipientModel } = require("../models/Recipient");
const { GenericRepo } = require("./generic");

class RecipientRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }

  getByIdAndTagId(tagId, _id) {
    return this.model.findOne({ _id, tag: tagId });
  }

  getByEmailAndTagId(tagId, email) {
    return this.model.findOne({ email, tag: tagId });
  }

  getByEmail(email) {
    return this.model.findOne({ email });
  }
}

const Recipient = new RecipientRepo(recipientModel);

exports.Recipient = Recipient;

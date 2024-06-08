const { GenericRepo } = require('./generic/index');
const { TagModel } = require('../models/Tag');

class TagRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }
  getById(_id) {
    return this.model.findById(_id).populate('user').exec()
  }

  getBySlug(slug) {
    return this.model.findOne({slug})
  }

  getRecipientById(tagId, recipientId) {
    return this.model.findOne({
      _id: tagId,
      "emailRecipients._id": recipientId
    });
  }

  getRecipientByEmail(tagId, recipientEmail) {
    return this.model.findOne({
      _id: tagId,
      'emailRecipients.email': recipientEmail
    });
  }

  updateRecipientByTagId(tagId, recipientEmail) {
    return this.model.findByIdAndUpdate(
      tagId,
      { $push: { recipients: { email: recipientEmail } } },
      { new: true, useFindAndModify: false }
    );

  }
  //mvp
  updateRecipients(tagId, recipientEmail) {
    return this.model.findByIdAndUpdate(
      tagId,
      { $push: { recipients: recipientEmail } },
      { new: true, useFindAndModify: false }
    );

  }

  updateRecipientEmail(tagId, newEmail) {
    return this.model.updateOne(
      { _id: tagId },
      { $set: { 'recipients': newEmail } }
    );
  }

  deleteRecipientById(tagId, recipientId) {
    return this.model.updateOne(
      { _id: tagId },
      { $pull: { emailRecipients: { _id: recipientId } } }
    );

  }
}

exports.Tag = new TagRepo(TagModel);
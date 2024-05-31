const { EmailTag } = require('../../database/repositories/emailTag.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require('../../libs/exceptions');
const { checkEmailRecipient } = require('../utils/index');

class EmailRecipientService {
  static async saveRecipients(tagId, recipients) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError("Email tag Not Found.");

    let updatedTag;
    for (const recipient of recipients) {
      const foundRecipient = await EmailTag.getRecipientByEmail(tagId, recipient.email);
      if (foundRecipient) throw new ResourceConflictError('Reciepient email alreay exist.');

      updatedTag = await EmailTag.updateRecipientByTagId(tagId, recipient.email)
    }
    if (!updatedTag) throw new InternalServerError("Unable to save email recipients in email tag table");

    return {
      message: "Saved email recipients under tag.",
      data: { savedRecipients:  updatedTag.emailRecipients }
    }
  }

  static async getRecipients(tagId) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    return {
      message: "Fetched email recipients for email tag",
      data: {recipients: tag.emailRecipients}
    }
  }

  static async getRecipient( tagId, recipientId) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");
    
    const foundRecipient = tag.emailRecipients.find(recipient => recipient._id.toString() === recipientId);

    return {
      message: "Check email recipient in email tag",
      data: {
        ...(!foundRecipient? { recipientExists: false } : { recipientExists: true, recipient: foundRecipient })
      }
    }
  }

  static async updateRecipient(tagId, recipientId, newEmail) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const recipientExists = checkEmailRecipient(recipientId, tag.emailRecipients)

    if (!recipientExists) throw new NotFoundError("Recipient email Not Found.");

    const updatedTag = await EmailTag.updateRecipientEmailByRecipientId(tagId, recipientId, newEmail);

    if (updatedTag.modifiedCount === 0) throw new InternalServerError("Unable to update tag recipient email");

    return{
      message: 'Updated email recipient email successfully.',
      data: { updatedTag: await EmailTag.getById(tagId) }
    }
  }

  static async deleteRecipient(tagId, recipientId) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const recipientExists = checkEmailRecipient(recipientId, tag.emailRecipients)

    if (!recipientExists) throw new NotFoundError("Recipient email Not Found.");

    const modifiedTagRecipients = await EmailTag.deleteRecipientById(tagId, recipientId);
    if (modifiedTagRecipients.modifiedCount !== 1) throw new InternalServerError('Unable to delete recipient email')

    return {
      message: "Deleted email recipient",
      data: { deletedRecipientId: recipientId }
    }
  }
}

exports.EmailRecipientService = EmailRecipientService;
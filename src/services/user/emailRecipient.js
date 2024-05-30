const { EmailTag } = require('../../database/repositories/emailTag.repo');
const { NotFoundError, InternalServerError } = require('../../libs/exceptions');

class EmailRecipientService {
  static async saveRecipients(tagId, recipients) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError("Email tag Not Found.");
    
    tag.emailRecipients = [ ...recipients ]

    const updatedTag = await EmailTag.save();
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

  static async getRecipient(email, tagId) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");
    
    const foundRecipient = tag.emailRecipients.find(recipient => recipient.email === email );

    return {
      message: "Check email recipient in email tag",
      data: {recipientExists: foundRecipient}
    }
  }

  static async updateRecipient(recipientId, tagId, updatedEmail) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const updatedRecipient = tag.emailRecipients.find(recipient => {
      if (recipient.id !== recipientId) throw new NotFoundError("Email recipient id not found.");
      recipient.email = updatedEmail;
      return recipient
    }) 

    // const updateRecipient = tag.emailRecipients.id
    if (!updatedRecipient) throw new InternalServerError('Unable to update recipient email');
    
    const updatedTag = tag.save();
    if (!updatedTag) throw new InternalServerError('Unabble to update tag');

    return{
      message: 'Updated email recipient email successfully.',
      data: { updatedRecipient }
    }
  }

  static async deleteRecipient(recipientId, tagId) {
    const tag = await EmailTag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const foundRecipient = tag.emailRecipients.find(recipient => recipient._id === recipientId);
    if (!foundRecipient) throw new NotFoundError('Email recipient Not Found.')

    const deletedRecipient = tag.emailRecipients.filter(recipient => recipient._id !== recipientId);
    if (!deletedRecipient) throw new InternalServerError('Unable to delete email recipient');
    
    const savedTag = await tag.save();
    if (!savedTag) throw new InternalServerError('Unable to save tag');

    return {
      message: "Deleted email recipient",
      data: { deletedRecipientId: recipientId }
    }
  }
}

exports.EmailRecipientService = EmailRecipientService;
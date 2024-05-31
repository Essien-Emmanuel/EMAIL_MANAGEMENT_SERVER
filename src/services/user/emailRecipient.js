const { EmailTag } = require('../../database/repositories/emailTag.repo');
const { NotFoundError, InternalServerError, ResourceConflictError, ServiceError } = require('../../libs/exceptions');

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

    let recipientExists = false;
    
    if (tag.emailRecipients.length > 0) {
      for (const recipient of tag.emailRecipients) {
        if (recipient._id.toString() === recipientId) {
          recipientExists = true
          break
        } 
      }
    } else throw new NotFoundError("Email tag has no recipients.");

    if (!recipientExists) throw new NotFoundError("Recipient email Not Found.");

    const updatedTag = await EmailTag.updateRecipientEmailByRecipientId(tagId, recipientId, newEmail);

    if (updatedTag.modifiedCount === 0) throw new InternalServerError("Unable to update tag recipient email");

    // const updatedRecipient = tag.emailRecipients.find(recipient => {
    //   if (recipient._id !== recipientId) throw new NotFoundError("Email recipient id not found.");
    //   recipient.email = newEmail;
    //   return recipient
    // }) 

    // // const updateRecipient = tag.emailRecipients.id
    // if (!updatedRecipient) throw new InternalServerError('Unable to update recipient email');
    // const updatedTag = tag.save();
    // if (!updatedTag) throw new InternalServerError('Unabble to update tag');

    return{
      message: 'Updated email recipient email successfully.',
      data: { updatedTag: await EmailTag.getById(tagId) }
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
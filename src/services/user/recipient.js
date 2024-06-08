const { response } = require('../../app');
const { Tag  } = require('../../database/repositories/tag.repo');
const { Recipient } = require('../../database/repositories/recipient.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require('../../libs/exceptions');
const { convertExcelFileToJsObject, convertCsvToObject } = require('../../utils');
const { checkEmailRecipient, updateRecipientFromFileResponseMsg } = require('../utils/index');

class RecipientService {
  static async saveRecipientsByTagId(tagId, recipients) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email tag Not Found.");

    if (recipients.length < 1) {
      return {
        message: 'No recipient provided for save',
        data: {}
      }
    }
    async function saveRecipientFromRecipients() {
      let savedSuccessCount = 0;
      let savedFailCount = 0;
      const existingRecipients = [];
      const unsavedRecipients = [];
      const savedRecipients = [];
      const unUpdatedTag = [];
      
      for (const recipient of recipients) {
        const foundRecipient = await Recipient.getByEmailAndTagId(tagId, recipient);
        if (foundRecipient) {
          existingRecipients.push(recipient);
          continue
        };

        const newRecipient = await Recipient.create({ email: recipient, tag: tag._id});
        if (!newRecipient) {
          savedFailCount += 0;
          unsavedRecipients.push(recipient);
          continue;
        }

        tag.recipients.push(newRecipient._id);

        const savedRecipient = await tag.save();
        if (!savedRecipient) {
          unUpdatedTag = tag.tag_name;
          continue;
        }
        savedSuccessCount += 1;
        savedRecipients.push(recipient);

      }
      return {
        savedSuccessCount,
        savedFailCount,
        unUpdatedTag,
        existingRecipients,
        unsavedRecipients,
        savedRecipients
      }
    
    }
    
    const savedRecipientSuccessInfo = await saveRecipientFromRecipients();
    const { savedSuccessCount, savedRecipients } = savedRecipientSuccessInfo;

    let savedAllRecipients; 
    let successMsg;
    let statusCode;

    if (savedSuccessCount > 0 && recipients.length === savedSuccessCount) {
      savedAllRecipients = savedRecipients;
      successMsg = `saved email recipients under ${tag.slug}, tag`;
      statusCode = 201;
    } else {
      savedAllRecipients = savedRecipientSuccessInfo;
      successMsg = 'Result of the operation'
      statusCode = 200;
    }

    return {
      statusCode,
      message: successMsg,
      data: { ...(statusCode === 200 ? { ...savedAllRecipients } : { savedRecipients: savedAllRecipients}) }
    }
  }

  static async saveRecipients(recipients) {
    console.log(recipients)
    if (recipients.length < 1) {
      return {
        message: 'No recipient provided for save',
        data: {}
      }
    }
    async function saveRecipientFromRecipients() {
      let savedSuccessCount = 0;
      let savedFailCount = 0;
      const existingRecipients = [];
      const unsavedRecipients = [];
      const savedRecipients = [];
      
      for (const recipient of recipients) {
        const foundRecipient = await Recipient.getByEmail( recipient);
        if (foundRecipient) {
          existingRecipients.push(recipient);
          continue
        };

        const newRecipient = await Recipient.create({ email: recipient });
        if (!newRecipient) {
          savedFailCount += 0;
          unsavedRecipients.push(recipient);
          continue;
        }

        savedSuccessCount += 1;
        savedRecipients.push(recipient);

      }
      return {
        savedSuccessCount,
        savedFailCount,
        existingRecipients,
        unsavedRecipients,
        savedRecipients
      }
    
    }
    
    const savedRecipientSuccessInfo = await saveRecipientFromRecipients();
    const { savedSuccessCount, savedRecipients } = savedRecipientSuccessInfo;

    let savedAllRecipients; 
    let successMsg;
    let statusCode;

    if (savedSuccessCount > 0 && recipients.length === savedSuccessCount) {
      savedAllRecipients = savedRecipients;
      successMsg = `saved email recipients`;
      statusCode = 201;
    } else {
      savedAllRecipients = savedRecipientSuccessInfo;
      successMsg = 'Result of the operation'
      statusCode = 200;
    }

    return {
      statusCode,
      message: successMsg,
      data: { ...(statusCode === 200 ? { ...savedAllRecipients } : { savedRecipients: savedAllRecipients}) }
    }
  }

  static async addRecipientToTag(tagId, recipientId) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email tag Not Found.");

    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError("Recipient with email Not Found.");
    
    const recipientContainsTag = await Recipient.getByIdAndTagId(tagId, recipientId);
    if (recipientContainsTag) throw  new ResourceConflictError("Recipient already has tag");

    tag.recipients.push(recipient._id);

    const updatedTag = await tag.save();
    if (!updatedTag) throw new InternalServerError('Unable to update tag with new recipient');

    recipient.tag = tagId;
    
    const updatedRecipient = await recipient.save();
    if (!updatedRecipient) throw new InternalServerError("Unable to update recipient");

    return {
      message: "Added recipient to tag successfully",
      data: { tag, recipient }
    }

  }
  
  static async saveRecipientFromRecipients(tagId, recipients) {
    const existingRecipients = [];
    let successCount = 0;
    let failedCount = 0;
    let updatedTag;

    for (const recipient of recipients) {
      const foundRecipient = await Tag.getRecipientByEmail(tagId, recipient.email);
      if (foundRecipient) {
        existingRecipients.push(recipient.email);
        continue
      } 

      updatedTag = await Tag.updateRecipientByTagId(tagId, recipient.email);
      
      if (updatedTag) {
        successCount += 1
        //send a welcome email out
      }
      else failedCount += 1;
    }

    const noOfRecipients = recipients.length;

    return {
      noOfRecipients, existingRecipients, successCount, failedCount
    };
  }

  static async saveRecipientsFromXlForOneTag(tagId, emailExcelFileBuffer) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    const recipients = await convertExcelFileToJsObject(emailExcelFileBuffer);

    
    const {
      noOfRecipients, existingRecipients, successCount, failedCount 
    } = await EmailRecipientService.saveRecipientFromRecipients(tagId, recipients);

    const responseObj = updateRecipientFromFileResponseMsg(noOfRecipients, existingRecipients, successCount, failedCount);

    return {
      message: responseObj.responseMsg,
      data: { ...responseObj.data }
    }

  }

  static async saveRecipientsFromCsvForOneTag(tagId, emailCsvFileBuffer) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    const convertedCsvFile = await convertCsvToObject(emailCsvFileBuffer);
    if (!convertedCsvFile.isConverted) throw new InternalServerError('CSV file not converted.');

    const recipients = convertedCsvFile.data;

    const {
      noOfRecipients, existingRecipients, successCount, failedCount 
    } = await EmailRecipientService.saveRecipientFromRecipients(tagId, recipients);

    const responseObj = updateRecipientFromFileResponseMsg(noOfRecipients, existingRecipients, successCount, failedCount);

    return {
      message: responseObj.responseMsg,
      data: { ...responseObj.data }
    }
  }

  static async getRecipients(tagId) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    return {
      message: "Fetched email recipients for email tag",
      data: {recipients: tag.emailRecipients}
    }
  }

  static async getRecipient( tagId, recipientId) {
    const tag = await Tag.getById(tagId);
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
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const recipientExists = checkEmailRecipient(recipientId, tag.emailRecipients)

    if (!recipientExists) throw new NotFoundError("Recipient email Not Found.");

    const updatedTag = await Tag.updateRecipientEmailByRecipientId(tagId, recipientId, newEmail);

    if (updatedTag.modifiedCount === 0) throw new InternalServerError("Unable to update tag recipient email");

    return{
      message: 'Updated email recipient email successfully.',
      data: { updatedTag: await Tag.getById(tagId) }
    }
  }

  static async removeRecipientFromTag(tagId, recipientId) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email tag Not Found.");

    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError('Recipient Not Found.');

    const recipientContainsTag = await Recipient.getByIdAndTagId(tagId, recipientId);
    if (!recipientContainsTag) throw new NotFoundError('Recipient Not In this tag');

    const filteredTagRecipients = tag.recipients.filter(recipient => recipient.toString() !== recipientId);
    tag.recipients = filteredTagRecipients;

    recipient.tag = null;

    const updatedTag = await tag.save();
    const updatedRecipient = await recipient.save();

    if (!updatedTag) throw new InternalServerError('Unable to update tag');
    if (!updatedRecipient) throw new InternalServerError('Unable to update recipient');

    return {
      message: "Removed recipient from tag successsfully",
      data: { tag, recipient }
    }
  }

  static async deleteRecipient(tagId, recipientId) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError('Email tag Not Found.');

    const recipientExists = checkEmailRecipient(recipientId, tag.emailRecipients)

    if (!recipientExists) throw new NotFoundError("Recipient email Not Found.");

    const modifiedTagRecipients = await Tag.deleteRecipientById(tagId, recipientId);
    if (modifiedTagRecipients.modifiedCount !== 1) throw new InternalServerError('Unable to delete recipient email')

    return {
      message: "Deleted email recipient",
      data: { deletedRecipientId: recipientId }
    }
  }
}

exports.RecipientService = RecipientService;
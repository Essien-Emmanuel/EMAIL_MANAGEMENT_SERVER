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

    let savedSuccessCount = 0;
    let savedFailCount = 0;
    const existingRecipients = [];
    const unsavedRecipients = [];
    const savedRecipients = [];
    const unUpdatedTag = [];

    for (const recipient of recipients) {
      const foundRecipient = await Recipient.getByEmailAndTagId(tagId, recipient.email);
      if (foundRecipient) {
        existingRecipients.push(recipient.email);
        continue
      };

      const newRecipient = await Recipient.create({ email: recipient.email, tag: tag._id});
      if (!newRecipient) {
        savedFailCount += 0;
        unsavedRecipients.push(recipient.email);
        continue;
      }

      tag.recipients.push(newRecipient._id);

      const savedRecipient = await tag.save();
      if (!savedRecipient) {
        unUpdatedTag = tag.tag_name;
        continue;
      }
      savedSuccessCount += 1;
      savedRecipients.push(recipient.email);

    }
   
    const savedRecipientSuccessInfo = {
      savedSuccessCount,
      savedFailCount,
      unUpdatedTag,
      existingRecipients,
      unsavedRecipients,
      savedRecipients
    }

    let savedAllRecipients; 
    let successMsg;

    if (savedSuccessCount > 0 && recipients.length === savedSuccessCount) {
      savedAllRecipients = savedRecipients;
      successMsg = `saved email recipients under ${tag.slug}, tag`;
    } else {
      savedAllRecipients = savedRecipientSuccessInfo;
      successMsg = 'success'
    }

    return {
      message: successMsg,
      data: { savedRecipients: savedAllRecipients }
    }
  }

  static async saveRecipients(recipients) {

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
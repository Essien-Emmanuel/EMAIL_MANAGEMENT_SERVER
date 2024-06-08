const mongoose = require('mongoose');
const { Tag  } = require('../../database/repositories/tag.repo');
const { Recipient } = require('../../database/repositories/recipient.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require('../../libs/exceptions');
const { convertExcelFileToJsObject, convertCsvToObject, deleteElementInList } = require('../../utils');
const { checkEmailRecipient, updateRecipientFromFileResponseMsg, sendRecipientWelcomeMail } = require('../utils/index');

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
    
    const mailResult = await sendRecipientWelcomeMail(savedRecipients);

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
      data: { 
        ...(statusCode === 200 ? { ...savedAllRecipients } : { savedRecipients: savedAllRecipients}),
        mailResponse: { 
          status: mailResult.status, 
          deliveryEmailCount: mailResult.deliveredEmail.length, 
          deliveredEmails: mailResult.deliveredEmail
        }
    }
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

    const mailResult = await sendRecipientWelcomeMail(savedRecipients);

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
      data: { 
        ...(statusCode === 200 ? { ...savedAllRecipients } : { savedRecipients: savedAllRecipients}),
        mailResponse: { 
          status: mailResult.status, 
          deliveryEmailCount: mailResult.deliveredEmail.length, 
          deliveredEmails: mailResult.deliveredEmail
        }
      }
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
    let successCount = 0;
    let failedCount = 0;
    let updatedTag;
    let savedRecipientCount = 0
    const savedRecipients = []
    const existingRecipients = [];

    for (const recipient of recipients) {
      const foundRecipient = await Recipient.getByEmailAndTagId(tagId, recipient.email);
      if (foundRecipient) {
        existingRecipients.push(recipient.email);
        continue
      } 
      
      const newRecipient = await Recipient.create({ email: recipient.email});
      newRecipient.tag = new mongoose.Types.ObjectId(tagId)
      await newRecipient.save()

      savedRecipientCount += 1;
      savedRecipients.push(recipient.email);

      updatedTag = await Tag.updateRecipients(tagId, newRecipient._id);
      
      if (updatedTag) {
        successCount += 1
        //send a welcome email out
      }
      else failedCount += 1;
    }

    const noOfRecipients = recipients.length;

    return {
      noOfRecipients, existingRecipients, successCount, failedCount, savedRecipientCount, savedRecipients
    };
  }

  static async saveRecipientsFromXlForOneTag(tagId, emailExcelFileBuffer) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    const recipientsObj = await convertExcelFileToJsObject(emailExcelFileBuffer);
    
    const {
      noOfRecipients, existingRecipients, successCount, failedCount, savedRecipientCount, savedRecipients
    } = await RecipientService.saveRecipientFromRecipients(tagId, recipientsObj);

    const mailResult = await sendRecipientWelcomeMail(savedRecipients);

    const responseObj = updateRecipientFromFileResponseMsg(noOfRecipients, existingRecipients, successCount, failedCount, savedRecipientCount, savedRecipients);

    return {
      message: responseObj.responseMsg,
      data: { ...responseObj.data,
        mailResponse: { 
          status: mailResult.status, 
          deliveryEmailCount: mailResult.deliveredEmail.length, 
          deliveredEmails: mailResult.deliveredEmail
        }
      }
    }

  }

  static async saveRecipientsFromCsvForOneTag(tagId, emailCsvFileBuffer) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    const convertedCsvFile = await convertCsvToObject(emailCsvFileBuffer);
    if (!convertedCsvFile.isConverted) throw new InternalServerError('CSV file not converted.');

    const recipientsObj = convertedCsvFile.data;

    const {
      noOfRecipients, existingRecipients, successCount, failedCount,  savedRecipientCount, savedRecipients
    } = await RecipientService.saveRecipientFromRecipients(tagId, recipientsObj);

    const mailResult = await sendRecipientWelcomeMail(savedRecipients);
    // let unsentRecipients;

    // if (!mailResult.success && mailResult.deliveredEmail.length > 0) {
    //   unsentRecipients = Object.values(recipientsObj);
    //   for (const email of mailResult.deliveredEmail ) {
    //     const index = unsentRecipients.findIndex(email);
    //     unsentRecipients.splice(index, 1);
    //   }
    // }

    const responseObj = updateRecipientFromFileResponseMsg(noOfRecipients, existingRecipients, successCount, failedCount,  savedRecipientCount, savedRecipients);

    return {
      message: responseObj.responseMsg,
      data: { 
        ...responseObj.data, 
        mailResponse: { 
          status: mailResult.status, 
          deliveryEmailCount: mailResult.deliveredEmail.length, 
          deliveredEmails: mailResult.deliveredEmail
        }
      }
    }
  }

  static async getRecipients(tagId) {
    const tag = await Tag.getById(tagId);
    if (!tag) throw new NotFoundError("Email Tag Not Found");

    return {
      message: "Fetched email recipients for email tag",
      data: {recipients: tag.recipients}
    }
  }

  static async getRecipient( recipientId) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError("Recipient Not Found");
    
    return {
      message: "Fetched recipient successfully",
      data: { recipient }
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

    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError('Recipient Not Found.');

    const recipientContainsTag = await Recipient.getByIdAndTagId(tagId, recipientId);
    if (recipientContainsTag) {
      const tagRecipientWithoutTargetRecipient = tag.recipients.filter(recipient => recipient.toString() !== recipientId);
      tag.recipients = tagRecipientWithoutTargetRecipient;
      await tag.save()
    }

    const deletedRecipient = await Recipient.delete(recipientId)
    if (deletedRecipient.modifiedCount !== 1) throw new InternalServerError('Unable to delete recipient')

    return {
      message: "Deleted email recipient",
      data: { deletedRecipientId: recipientId }
    }
  }
}

exports.RecipientService = RecipientService;
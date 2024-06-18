const { EmailFailure } = require('../../database/repositories/emailfailure');
const { Recipient } = require('../../database/repositories/recipient.repo');
const { ResourceConflictError, InternalServerError, ServiceError } = require('../../libs/exceptions');
const { APIMailer } = require('../../libs/mailer/adaptee/mailTrap');
const { checkUndoActionTime } = require("../../utils");


class RecipientService {
  static async addRecipient(userId, { first_name, email},) {
    const recipient = await Recipient.getByEmail(email);
    if (recipient) throw new ResourceConflictError('Recipient already exists.');

    const newRecipient = await Recipient.create({ first_name, email, user: userId });
    if (!newRecipient) throw new InternalServerError('Unable to save new Recipient');
    
    //send an email with link to confirm emails
    const subject = 'Interactro🚀';
    const text = `
    New Subscriber Request

    click the link http://localhost:8084/api/v1/user/subscriber/request/confirm?recipientId=${newRecipient._id.toString()} to confirm the subscription request.

    click the link http://localhost:8084/api/v1/user/subscriber/request/deny?newRecipientId=${newRecipient._id.toString()} to deny the subscription request.
    `;
    
    const mailResponse = await APIMailer.send({ to: email, subject, text });
    if (!mailResponse.success) {
      await EmailFailure.create({ recipient: newRecipient._id, failure_reason: mailResponse.message})
      throw new ServiceError('Error in sending email.');
    } 
      
    return {
      message: 'Added new recipient',
      data: { newRecipient, link: text }
    }
  }
  
  static async deleteRecipient( recipientId ) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError('Recipient Not Found.');

    recipient.is_deleted = true;
    recipient.deletedAt = Date.now();

    const deletedRecipient = await recipient.save();
    if (deletedRecipient.modifiedCount === 0) throw new InternalServerError('Unable to delete recipient.');

    return {
      message: 'Deleted recipient successfully. Undo action within 30 days.',
      data: { deletedRecipient }
    }
  }

  static async undoDeleteRecipientAction( recipientId ) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError('Recipient Not Found.');

    if (!recipient.is_deleted) return {
      message: 'Recipient is not deleted',
      data: { recipient }
    }

    const undoableDeleteAction = checkUndoActionTime({ selectedTime: recipient.deletedAt });
    if(!undoableDeleteAction) return {
      message: "Undo action is past 30days. Undo Action expired"
    }

    recipient.is_deleted = false;
    recipient.deletedAt = null;
    await recipient.save();

    return {
      message: 'Undo delete action successful. Recipient restored.',
      data: { restoredRecipient: recipient }
    }
  }
}

exports.RecipientService = RecipientService;
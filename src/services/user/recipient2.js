const { EmailFailure } = require('../../database/repositories/emailfailure');
const { Recipient } = require('../../database/repositories/recipient.repo');
const { ResourceConflictError, InternalServerError, ServiceError } = require('../../libs/exceptions');
const { APIMailer } = require('../../libs/mailer/adaptee/mailTrap');

class RecipientService {
  static async addRecipient(userId, { first_name, email},) {
    const recipient = await Recipient.getByEmail(email);
    if (recipient) throw new ResourceConflictError('Recipient already exists.');

    const newRecipient = await Recipient.create({ first_name, email, user: userId });
    if (!newRecipient) throw new InternalServerError('Unable to save new Recipient');

    //send an email with link to confirm emails
    const subject = 'Interactro:: New Subscriber Request ❓';
    const text = `
      click the link http://localhost:8084/api/v1/user/subscriber/request/confirm to confirm the subscription request
      or
      click the link http://localhost:8084/api/v1/user/subscriber/request/deny to deny the subscription request
    `;

    const mailResponse = await APIMailer({ to: email, subject, text });
    if (!mailResponse.success) {
      await EmailFailure.create({ recipient: newRecipient._id, failure_reason: ''})
      throw new ServiceError('Error in sending email.');
    } 
      

    return {
      message: 'Added new recipient',
      data: { newRecipient }
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
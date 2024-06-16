const { SubscripitonRequestEnum } = require("../../database/enums");
const { Recipient } = require("../../database/repositories/recipient.repo");
const { Subscriber } = require('../../database/repositories/subscriber.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require("../../libs/exceptions");

class Subscriber {
  static async confirmSubscriptionRequest( recipientId ) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError('Recipient Not Found.');

    recipient.is_confirmed = true;
    recipient.subscription_request = SubscripitonRequestEnum.CONFIRMED;

    const updatedRecipient = await recipient.save;
    if (updatedRecipient.modifiedCount === 0) throw new InternalServerError("Unable to update recipient.");
    
    const newSubscriber = await Subscriber.create({
      first_name: recipient.first_name,
      email: recipient.email,
      is_confirmed: recipient.is_confirmed,
      user: recipient.user
    });

    if (!newSubscriber) throw new InternalServerError('Unable to create Subscriber after subscription confirmation');

    return { 
      message: 'Subscriber confirmed successfully.',
      data: {
        updatedRecipient,
        newSubscriber
      }
    }
  }

  static async denySubscriptionRequest( recipientId ) {
    const recipient = await Recipient.getById(recipientId);
    if ( !recipient) throw new NotFoundError('Recipient Not Found.');

    recipient.is_confirmed = false;
    recipient.subscription_request = SubscripitonRequestEnum.DENIED;
    await recipient.save();

    return {
      message: 'Subscriber denied successfully',
      data: { deniedSubscriber: recipient }
    }
  }

  static async addSubscriber(userId, payload) {
    const subscriber = await Subscriber.getByEmail(payload.email);
    if (subscriber) throw new ResourceConflictError('Subscriber already exist.');

    const newSubscriber = await Subscriber.create({
      ...payload,
      user: userId
    });
    if (!newSubscriber) throw new InternalServerError('Unable to create new subscriber.');

    return {
      message: 'Added new subscriber successfully.',
      data: { newSubscriber }
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

    //if recipient.deletedAt - Date.now() >= 30days
  }
}

exports.Subscriber = Subscriber;
const { SubscripitonRequestEnum } = require("../../database/enums");
const { Recipient } = require("../../database/repositories/recipient.repo");
const { Subscriber } = require('../../database/repositories/subscriber.repo');
const { NotFoundError, InternalServerError } = require("../../libs/exceptions");

class Subscriber {
  static async confirmSubscriptionRequest({ recipientId }) {
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

  static async denySubscriptionRequest() {

  }

  static async addSubscriber() {

  }



  static async removeRecipient() {

  }
}

exports.Subscriber = Subscriber;
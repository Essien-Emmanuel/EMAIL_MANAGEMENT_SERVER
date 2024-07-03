const { SubscripitonRequestEnum } = require("../../database/enums");
const { List } = require("../../database/repositories/list.repo");
const { Recipient } = require("../../database/repositories/recipient.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const {
  NotFoundError,
  InternalServerError,
  ResourceConflictError,
  ServiceError,
} = require("../../libs/exceptions");
const { convertCsvToObject } = require("../../utils");

class SubscriberService {
  static async confirmSubscriptionRequest(recipientId) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError("Recipient Not Found.");

    const subscriber = await Subscriber.getByEmail(recipient.email);
    if (subscriber) throw new ResourceConflictError("Recipient already exist");

    recipient.is_confirmed = true;
    recipient.subscription_request = SubscripitonRequestEnum.CONFIRMED;

    const updatedRecipient = await recipient.save();
    if (updatedRecipient.modifiedCount === 0)
      throw new InternalServerError("Unable to update recipient.");

    const newSubscriber = await Subscriber.create({
      first_name: recipient.first_name,
      email: recipient.email,
      is_confirmed: recipient.is_confirmed,
      user: recipient.user,
    });

    if (!newSubscriber)
      throw new InternalServerError(
        "Unable to create Subscriber after subscription confirmation"
      );

    return {
      message: "Subscriber confirmed successfully.",
      data: {
        updatedRecipient,
        newSubscriber,
      },
    };
  }

  static async denySubscriptionRequest(recipientId) {
    const recipient = await Recipient.getById(recipientId);
    if (!recipient) throw new NotFoundError("Recipient Not Found.");

    const subscriber = await Subscriber.getByEmail(recipient.email);
    if (subscriber) throw new ServiceError("Subscriber already confirmed");

    recipient.is_confirmed = false;
    recipient.subscription_request = SubscripitonRequestEnum.DENIED;
    await recipient.save();

    return {
      message: "Subscriber denied successfully",
      data: { deniedSubscriber: recipient },
    };
  }

  static async includeSubscriber({ forms, sequences, lists, subscriberId }) {
    if (forms.length > 0) {
      // do something
    }

    if (sequences.length > 0) {
      // do something
    }

    if (lists.length > 0) {
      for (const listId of lists) {
        const list = await List.getById(listId);
        if (!list) continue;

        list.subscribers.push(subscriberId);
        await list.save();

        const subscriber = await Subscriber.getById(subscriberId);
        subscriber.lists.push(list._id);
        await subscriber.save();
      }
    }

    const retrievedSubscriber = await Subscriber.getById(subscriberId);
    return retrievedSubscriber;
  }

  static async addSubscriber(userId, payload) {
    const { firstName: first_name, email, lists, sequences, forms } = payload;

    const subscriber = await Subscriber.getByEmail(email);
    if (subscriber)
      throw new ResourceConflictError("Subscriber already exist.");

    const newSubscriber = await Subscriber.create({
      first_name,
      email,
      is_confirmed: true,
      user: userId,
    });
    if (!newSubscriber)
      throw new InternalServerError("Unable to create new subscriber.");

    const retrievedSubscriber = await SubscriberService.includeSubscriber({
      forms,
      lists,
      sequences,
      subscriberId: newSubscriber._id,
    });

    return {
      message: "Added new subscriber successfully.",
      data: { newSubscriber: retrievedSubscriber },
    };
  }

  static async importSubscribersFromCsv(
    userId,
    subscribersFileBuffer,
    payload
  ) {
    const { forms, sequences, lists } = payload;
    const convertedCsv = await convertCsvToObject(subscribersFileBuffer);
    if (!convertedCsv.isConverted)
      throw new InternalServerError("Unable to read csv file");

    const subscribers = convertedCsv.data;

    //save each subscriber
    const existingSubscribers = [];
    const unsavedSubscribers = [];
    const savedSubscribers = [];
    let successCount = 0;

    for (const subscriber of subscribers) {
      const foundSubscriber = await Subscriber.getByEmail(subscriber.email);
      if (foundSubscriber) existingSubscribers.push(subscriber.email);

      const newSubscriber = await Subscriber.create({
        first_name: subscriber.first_name,
        email: subscriber.email,
        is_confirmed: true,
        user: userId,
      });

      if (!newSubscriber) {
        unsavedSubscribers.push(subscriber.email);
        continue;
      }

      await SubscriberService.includeSubscriber({
        forms,
        lists,
        sequences,
        subscriberId: newSubscriber._id,
      });

      savedSubscribers.push(subscriber.email);
      successCount += 1;
    }

    const response = { message: "", data: {} };

    if (successCount === subscribers.length) {
      response.message = "Successfully saved all subscribers.";
      response.data.savedSubscribers = savedSubscribers;
    } else if (unsavedSubscribers.length === subscribers.length) {
      response.message = "Unable to save any subscriber";
      response.data.unsavedSubscribers = unsavedSubscribers;
    } else if (successCount > 0 && successCount < subscribers.length) {
      (response.message = `Saved ${successCount} subscribers`),
        (response.data.savedSubscribers = savedSubscribers);
    }

    return {
      statusCode: 201,
      ...response,
    };
  }
}

exports.SubscriberService = SubscriberService;

const { BroadcastStatusEnum } = require("../../database/enums");
const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { Draft } = require("../../database/repositories/draft.repo");
const { List } = require("../../database/repositories/list.repo");
const {
  ProviderConfig,
} = require("../../database/repositories/providerConfig.repo");
const {
  ServiceProvider,
} = require("../../database/repositories/serviceProvider.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const {
  ValidationError,
  InternalServerError,
  NotFoundError,
} = require("../../libs/exceptions");
const { createMongooseId } = require("../../utils");
const { sendMail } = require("./sendMail");

class BroadcastService {
  /** SCHEDULE AND SEND BROADCAST */
  static async sendBroadcast(
    userId,
    {
      email: htmlContent,
      subject,
      sendingFrom = [],
      sendingTo = [{}],
      scheduledTime = null,
      publishStatus,
    }
  ) {
    const fromObjectIdArr = sendingFrom.map((providerConfig) =>
      createMongooseId(Object.values(providerConfig)[0])
    );

    if (sendingFrom.length < 1) throw new ValidationError("No Sender added.");
    if (sendingTo.length < 1)
      throw new ValidationError("No Subscriber added for broadcast");

    const subscriberIdsList = [];
    const invalidListId = [];
    for (const recipient of sendingTo) {
      if (recipient.listId) {
        const list = await List.getById(recipient.listId);
        if (!list) {
          invalidListId.push(recipient.listId);
        }
        for (const subscriberId of list.subscribers) {
          if (subscriberIdsList.includes(subscriberId)) continue;
          subscriberIdsList.push(subscriberId.toString());
        }
      }

      if (recipient.subscriberId) {
        if (subscriberIdsList.includes(recipient.subscriberId)) continue;

        const subscriber = await Subscriber.getById(recipient.subscriberId);
        if (!subscriber) continue;

        subscriberIdsList.push(recipient.subscriberId);
      }
    }

    const subscriberListObjectIds = subscriberIdsList.map((subscriberListId) =>
      createMongooseId(subscriberListId)
    );

    const newBroadcast = await Broadcast.create({
      email: htmlContent,
      subject,
      providerConfig: fromObjectIdArr,
      subscribers: subscriberListObjectIds,
      total_subscribers: subscriberIdsList.length,
      publish_status: publishStatus,
      ...(publishStatus ? { publish_date: Date.now() } : {}),
      user: userId,
    });

    if (!newBroadcast)
      throw new InternalServerError("Unable to create broadcast");

    /** SCHEDULE BROADCAST */
    if (scheduledTime) {
      newBroadcast.status = BroadcastStatusEnum.SCHEDULED;
      newBroadcast.scheduled_at = scheduledTime;
      await newBroadcast.save();

      return {
        statusCode: 201,
        message: "Broadcast created successfully.",
        data: { newBroadcast, broadcastScheduledTime: scheduledTime },
      };
    }

    /** SEND BROADCAST */
    const providerConfigId = sendingFrom[0].providerConfigId;

    const providerConfig = await ProviderConfig.getById(providerConfigId);
    if (!providerConfig) throw new NotFoundError("Provider config not found.");

    const serviceProvider = await ServiceProvider.getById(
      providerConfig.service_provider
    );
    const serviceProviderName = serviceProvider.name;

    const emailPayload = { subject, text: htmlContent, htmlPart: htmlContent };

    const mailResponsePromises = await sendMail({
      providerConfig: providerConfig.config,
      serviceProviderName,
      subscriberIdsList,
      emailPayload,
    });

    const { sentEmails, unsentEmails } = mailResponsePromises;

    let retrievedBroadcast;
    if (sentEmails.length > 0) {
      newBroadcast.status = BroadcastStatusEnum.SENT;
      await newBroadcast.save();
      retrievedBroadcast = await Broadcast.getById(newBroadcast._id);
    }

    const sentBroadcast = retrievedBroadcast
      ? retrievedBroadcast
      : newBroadcast;

    return {
      statusCode: 201,
      message: "Broadcast created successfully.",
      data: { newBroadcast: sentBroadcast, sentEmails, unsentEmails },
    };
  }

  static async publishBroadcast(broadcastId) {}

  static async unscheduleBroadcast(broadcastId) {
    const broadcast = await Broadcast.getById(broadcastId);
    if (!broadcast) throw new NotFoundError("Broadcast not found.");

    if (broadcast.status !== BroadcastStatusEnum.SCHEDULED)
      throw new ValidationError("Broadcast is not scheduled");

    const newDraft = await Draft.create({
      title: broadcast.subject,
      content: broadcast.email,
      user: broadcast.user,
    });
    if (!newDraft) throw new InternalServerError("Unable to create draft");

    broadcast.scheduled_at = null;
    broadcast.status = BroadcastStatusEnum.PENDING;
    broadcast.draft = newDraft._id;

    await broadcast.save();

    return {
      statusCode: 201,
      message: "Draft created successfully",
      data: { newDraft },
    };
  }

  static async duplicateBroadCast(broadcastId) {
    const broadcast = await Broadcast.getById(broadcastId);
    if (!broadcast) throw new NotFoundError("Broadcast not found.");

    broadcast.copy_count++;

    const newBroadcastDup = await Broadcast.create({
      email: broadcast.email,
      subject: `${broadcast.subject} (copy)`,
      providerConfig: broadcast.providerConfig,
      subscribers: broadcast.subscribers,
      total_subscribers: broadcast.total_subscribers,
      publish_status: broadcast.publish_status,
      publish_date: broadcast.publish_date,
      isDuplicate: true,
      originalBroadcastId: createMongooseId(broadcast._id),
      user: broadcast.user,
    });

    if (!newBroadcastDup)
      throw new InternalServerError("Unable to duplicate broadcast");

    await broadcast.save();

    return {
      statusCode: 201,
      message: "Broadcast duplicated successfully",
      data: { duplicatedBroadcast: newBroadcastDup },
    };
  }

  static async getBroadcast(broadcastId) {
    const broadcast = await Broadcast.getById(broadcastId);
    if (!broadcast) throw new NotFoundError("Broadcast not found.");

    return {
      message: "Fetched broadcast successfully.",
      data: { broadcast },
    };
  }

  static async getAllBroadcasts(userId) {
    const broadcasts = await Broadcast.getAll({ user: userId });
    if (broadcasts.length < 0)
      throw new NotFoundError("No broadcast exist for this user.");

    return {
      message: "Fetched all broadcasts successfully",
      data: { broadcasts },
    };
  }

  static async editBroadcast(broadcastId, editDto) {
    const broadcast = await Broadcast.getById(broadcastId);
    if (!broadcast) throw new NotFoundError("Broadcast not found.");

    // Remember to constrain what can be edited using the input schema validation

    const editedBroadcast = await Broadcast.update(
      { _id: broadcastId },
      editDto
    );
    if (editedBroadcast.modifiedCount !== 1)
      throw new InternalServerError("Unble to edit broadcast.");

    const retrievedBroadcast = await Broadcast.getById(broadcastId);

    return {
      message: "Broadcast edited successfully",
      data: { editedBroadcast: retrievedBroadcast },
    };
  }

  static async deleteBroadcast(broadcastId) {
    const broadcast = await Broadcast.getById(broadcastId);
    if (!broadcast) throw new NotFoundError("Broadcast not found");

    const deletedBroadcast = await Broadcast.delete(broadcastId);
    if (deletedBroadcast.deletedCount !== 1)
      throw new InternalServerError("Unable to delete broadcast.");

    return {
      message: "Broadcast deleted successfully.",
      data: { deletedBroadcastId: broadcastId },
    };
  }
}
exports.BroadcastService = BroadcastService;

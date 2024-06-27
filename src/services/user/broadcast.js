const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { List } = require("../../database/repositories/list.repo");
const { ProviderConfig } = require("../../database/repositories/providerConfig.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { ValidationError, InternalServerError, NotFoundError } = require("../../libs/exceptions");
const { createMongooseId } = require("../../utils");

class BroadcastService {
    static async sendBroadcast(userId, { email, subject, sendingFrom = [], sendingTo = [{}], scheduledTime = null, publishStatus }) {
        if (sendingFrom.length < 1 ) throw new ValidationError('No Sender added.')
        if (sendingTo.length < 1 ) throw new ValidationError('No Subscriber added for broadcast');
        
        // get subscribers id
        const subscribersIdList = []
        const invalidListId = [];
        for (const recipient of sendingTo ) {
            if (recipient.listId) {
                const list = await List.getById(recipient.listId);
                if (!list) {
                    invalidListId.push(recipient.listId);
                }
                for (const subscriberId of list.subscribers) {
                    if (subscribersIdList.includes(subscriberId)) continue
                    subscribersIdList.push(subscriberId.toString())
                }
            }
            
            if (recipient.subscriberId) {
                if (subscribersIdList.includes(recipient.subscriberId)) continue;

                const subscriber = await Subscriber.getById(recipient.subscriberId);
                if (!subscriber) continue;

                subscribersIdList.push(recipient.subscriberId);
            }
        }

        const subscriberListObjectIds = subscribersIdList.map(subscriberListId => createMongooseId(subscriberListId));

        // const newBroadcast = await Broadcast.create({
        //     email,
        //     subject,
        //     from: sendingFrom,
        //     subscribers: subscriberListObjectIds,
        //     total_subscribers: subscribersIdList.length,
        //     publish_status: publishStatus,
        //     ...(publishStatus ? { publish_date: Date.now() } : {}),
        //     user: userId
        // });

        // if (!newBroadcast) throw new InternalServerError('Unable to create broadcast');

        if (scheduledTime) {
            // newBroadcast.scheduled_time = scheduledTime;
            // await newBroadcast.save()
            //send broadcast at scheduled time
        } else {
            //send broadcast
            
        }

        //send broadcast
        // get the service provider config
        const providerConfigId = sendingFrom[0].providerConfigId

        const providerConfig = await ProviderConfig.getById(providerConfigId);
        if (!providerConfig) throw new NotFoundError('Provider config not found.');

        // iterate through the subscribers id
        for (const subscriberId of subscribersIdList) {
            // get each subscriber email using the id
            const subscriber = await Subscriber.getById(subscriberId);

            const email = subscriber.email;
            // send email to the email addresses using service provider

        }

        return {
            statusCode: 201,
            message: "Broadcast created successfully.",
            data: { newBroadcast }
        }

    }

    static async publishBroadcast() {} 

    static async scheduleBroadcast() {}

    static async unscheduleBroadcast() {}

    static async duplicateBroadCast() {}

    static async editBroadcast(){}

    static async deleteBroadcast() {}
}

exports.BroadcastService = BroadcastService;
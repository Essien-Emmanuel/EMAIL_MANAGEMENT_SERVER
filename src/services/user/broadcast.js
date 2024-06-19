const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { ValidationError, InternalServerError } = require("../../libs/exceptions");

class BroadcastService {
    static async sendBroadcast({email, subject, sendingFrom = [], sendingTo = [], scheduledTime = null, publishStatus }) {
        if (sendingFrom.length < 1 ) throw new ValidationError('No Sender added.')
        if (sendingTo.length < 1 ) throw new ValidationError('No Subscriber added for broadcast');

        const subscribersList = [];
        for (const $subscribers of sendingTo ) {
            const subscribers = await Subscriber.getAll($subscribers);
            if (!subscribers) continue;

            for (const subscriber of subscribers) {
                subscribersList.push(subscriber._id);
            }
        }

        const newBroadcast = await Broadcast.create({
            email,
            subject,
            from: sendingFrom,
            subscribers: subscribersList,
            total_subscribers: subscribersList.length,
            publish_status: publicStatus,
            ...(publishStatus ? { publish_date: Date.now() } : {})
        });

        if (!newBroadcast) throw new InternalServerError('Unable to create broadcast');

        if (scheduledTime) {
            newBroadcast.scheduled_time = scheduledTime;
            await newBroadcast.save()
            //send broadcast at scheduled time
        } else {
            //send broadcast at scheduled time
        }

        return {
            statusCode: 201,
            message: "Broadcast created successfully.",
            data: { newBroadcast }
        }

    }

    static async publishBroadcast() {}
}

exports.BroadcastService = BroadcastService;
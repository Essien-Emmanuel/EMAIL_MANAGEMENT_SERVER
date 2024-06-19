const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { ValidationError, InternalServerError } = require("../../libs/exceptions");

class BroadcastService {
    static async sendBroadcast(userId, {email, subject, sendingFrom = [], sendingTo = [{}], scheduledTime = null, publishStatus }) {
        if (sendingFrom.length < 1 ) throw new ValidationError('No Sender added.')
            if (sendingTo.length < 1 ) throw new ValidationError('No Subscriber added for broadcast');
        
        const subscribersIdList = [];
        for (const $subscribers of sendingTo ) {
            const filter = $subscribers._id ? { _id: $subscribers._id } : {}
            const subscribers = await Subscriber.getAll(filter);
            if (!subscribers) continue;

            for (const subscriber of subscribers) {
                subscribersIdList.push(subscriber._id.toString());
                // const broadcast = await Broadcast.getByFilter({ email, subject, user: userId});
                // if (!broadcast) {
                //     continue;
                // } 
                // for (const foundSubscriber of broadcast.subscribers) {
                //     if (subscriber !== foundSubscriber ) console.log()
                // }
            }
        }
        return { data: { subscribers: subscribersIdList}}
        const newBroadcast = await Broadcast.create({
            email,
            subject,
            from: sendingFrom,
            subscribers: subscribersIdList,
            total_subscribers: subscribersIdList.length,
            publish_status: publicStatus,
            ...(publishStatus ? { publish_date: Date.now() } : {}),
            user: userId
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
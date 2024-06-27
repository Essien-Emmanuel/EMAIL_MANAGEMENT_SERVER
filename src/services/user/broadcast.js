const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { List } = require("../../database/repositories/list.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { ValidationError, InternalServerError } = require("../../libs/exceptions");

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
                list.subscribers.map(subscriberId => subscribersIdList.push(subscriberId))
            }
            
            const filter = recipient.subscriberId? { _id: recipient.subscriberId } : {}
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

    static async scheduleBroadcast() {}

    static async unscheduleBroadcast() {}

    static async duplicateBroadCast() {}

    static async editBroadcast(){}

    static async deleteBroadcast() {}
}

exports.BroadcastService = BroadcastService;
const { Broadcast } = require("../../database/repositories/broadcast.repo");
const { List } = require("../../database/repositories/list.repo");
const { ProviderConfig } = require("../../database/repositories/providerConfig.repo");
const { ServiceProvider } = require("../../database/repositories/serviceProvider.repo");
const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { ValidationError, InternalServerError, NotFoundError } = require("../../libs/exceptions");
const { createMongooseId,  } = require("../../utils");
const { sendMail } = require("./sendMail");


class BroadcastService {
    static async sendBroadcast(userId, { email: htmlContent, subject, sendingFrom = [], sendingTo = [{}], scheduledTime = null, publishStatus }) {
        const fromObjectIdArr = sendingFrom.map(providerConfig => createMongooseId(Object.values(providerConfig)[0])); 

        if (sendingFrom.length < 1 ) throw new ValidationError('No Sender added.')
            if (sendingTo.length < 1 ) throw new ValidationError('No Subscriber added for broadcast');
        
        // get subscribers id
        const subscriberIdsList = []
        const invalidListId = [];
        for (const recipient of sendingTo ) {
            if (recipient.listId) {
                const list = await List.getById(recipient.listId);
                if (!list) {
                    invalidListId.push(recipient.listId);
                }
                for (const subscriberId of list.subscribers) {
                    if (subscriberIdsList.includes(subscriberId)) continue
                    subscriberIdsList.push(subscriberId.toString())
                }
            }
            
            if (recipient.subscriberId) {
                if (subscriberIdsList.includes(recipient.subscriberId)) continue;
                
                const subscriber = await Subscriber.getById(recipient.subscriberId);
                if (!subscriber) continue;
                
                subscriberIdsList.push(recipient.subscriberId);
            }
        }
        
        const subscriberListObjectIds = subscriberIdsList.map(subscriberListId => createMongooseId(subscriberListId));

        const newBroadcast = await Broadcast.create({
            email: htmlContent,
            subject,
            providerConfig: fromObjectIdArr,
            subscribers: subscriberListObjectIds,
            total_subscribers: subscriberIdsList.length,
            publish_status: publishStatus,
            ...(publishStatus ? { publish_date: Date.now() } : {}),
            user: userId
        });

        if (!newBroadcast) throw new InternalServerError('Unable to create broadcast');

        if (scheduledTime) {
            newBroadcast.scheduled_time = scheduledTime;
            await newBroadcast.save()

            return {
                statusCode: 201,
                message: "Broadcast created successfully.",
                data: { newBroadcast, broadcastScheduleTime: scheduledTime }
            }
        } 

        const providerConfigId = sendingFrom[0].providerConfigId
        
        const providerConfig = await ProviderConfig.getById(providerConfigId);
        if (!providerConfig) throw new NotFoundError('Provider config not found.');
        
        const serviceProvider = await ServiceProvider.getById(providerConfig.service_provider);
        const serviceProviderName = serviceProvider.name;

        const emailPayload = { subject, text: htmlContent, htmlPart: htmlContent }
    
        const mailResponsePromises =  await sendMail({providerConfig: providerConfig.config, 
            serviceProviderName, 
            subscriberIdsList, 
            emailPayload
        });

        const { sentEmails, unsentEmails } = mailResponsePromises;

        return {
            statusCode: 201,
            message: "Broadcast created successfully.",
            data: { newBroadcast, sentEmails, unsentEmails }
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
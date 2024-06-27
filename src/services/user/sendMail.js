const { Subscriber } = require("../../database/repositories/subscriber.repo");
const { MailFactory } = require("../../libs/mailer");
const { replaceEmailPlaceholders } = require("../utils");


async function sendMail({providerConfig, serviceProviderName, subscriberIdsList, emailPayload}) {
  const mailResponsePromises = []

  for (const subscriberId of subscriberIdsList) {
      const { email, first_name} = await Subscriber.getById(subscriberId);

      const subscriber = { email, first_name}
      const personalizedEmail = replaceEmailPlaceholders(emailPayload.text, subscriber);
                      
      const Mail = new MailFactory(providerConfig).getSender(serviceProviderName);
      const mailResponsePromise =  Mail.send({
           ...emailPayload, 
           to: email, 
           text: personalizedEmail, 
           htmlPart: personalizedEmail
      });
      
      mailResponsePromises.push(mailResponsePromise);
  }
  
  let mailResponses;
  const sentEmails = [];
  const unsentEmails = []

  try {
      const result = await Promise.all(mailResponsePromises);
      mailResponses = result;
  } catch (error) {
      console.log(error)
      // await EmailFailure.create({ })
  }

  for (const mailResponse of mailResponses) {
      if (mailResponse.success) sentEmails.push(mailResponse.email);
      else unsentEmails.push(mailResponse.email);
  }

  return { sentEmails, unsentEmails }
}

exports.sendMail = sendMail
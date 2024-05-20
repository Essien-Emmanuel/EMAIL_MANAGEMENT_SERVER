// module.exports = async function() {
//   const providerConfig = await ProviderConfig.findOne({name: sender_provider_name});
//   if (!providerConfig) throw new Error('not found');
  
//   const provider = await service.getSender(providerConfig)

//   const template = await Template.findById(templateId);
//   const message = await service.compileTemplate(template, data);

//   await provider.send(sender, receiver, message);

//   return {
//     status: 'ok'
//   }
// }

const { Template } = require('../../database/repositories/template.repo');
const { ServiceProvider } = require('../../database/repositories/serviceProvider.repo');
const { ProviderConfig } = require('../../database/repositories/providerConfig.repo')
const { NotFoundError, InternalServerError, ValidationError } = require('../../libs/exceptions/index');
const { sendMultipleEmail } = require('../../libs/mailer/utils');
const { checkValidVariables } = require('../../utils/index');

class MailerService {
  static async sendMail({userId, recipients, variables, templateId, serviceProviderId}) {
    const template = await Template.getById(templateId);
    if (!template) throw new NotFoundError('Template Not Found!');

    const serviceProvider = await ServiceProvider.getById(serviceProviderId);
    if (!serviceProvider ) throw new NotFoundError('Mail Service Provider Not Found!');

    const isValidVariables = checkValidVariables(variables, template.personalizedVariables);
    if (isValidVariables) throw new ValidationError('Varables is Invalid!');

    const providerConfig = await ProviderConfig.getbyUserIdAndServiceProvider({
      userId,
      serviceProviderId
    });
    if (!providerConfig) throw new NotFoundError('Configurations Not Found!');
    
    const config = providerConfig.config
    
    const sendMails = await sendMultipleEmail({
      recipients, 
      template, 
      variables, 
      serviceProvider, 
      containsHtmlPart: providerConfig.emailContainsHtmlPart, 
      config
    });
    if (sendMails.status === 'failed') throw new InternalServerError('Unable to send mails!')
      
      return {
        message: 'Mail Sent!',
        data: {
          successCount: sendMails.successCount,
          mailedRecipients: sendMails.mailedRecipients
        }
      }
    }
  }
  
  const r1 = {
    "to": ["user@example.com"],
    "templateId": 1,
    "variables": {"name": "John Doe"}
  }
  
exports.MailerService = MailerService;
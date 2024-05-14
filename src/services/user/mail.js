const { Template } = require('../../database/repositories/template.repo');
const { MailServiceProvider} = require('../../database/repositories/mailServiceProvider.repo');
const { MailTrapCredential } = require('../../database/repositories/MailTrapCredential.repo')
const { NotFoundError, InternalServerError, ValidationError } = require('../../libs/exceptions/index');
const { sendMultipleEmail } = require('../../libs/mailer/utils');
const { checkValidVariables, replacePlaceholders } = require('../../utils/index');

class MailService {
  static async sendMail({userId, recipients, variables, templateId, serviceProviderId}) {
    const template = await Template.getById(templateId);
    if (!template) throw new NotFoundError('Template Not Found!');

    const MSProvider = await MailServiceProvider.getById(serviceProviderId);
    if (!MSProvider) throw new NotFoundError('Mail Service Provider Not Found!');

    const isValidVariables = checkValidVariables(variables, template.personalizedVariables);
    if (isValidVariables) throw new ValidationError('Varables is Invalid!');

    const mailTrapConfig = await MailTrapCredential.getbyUserIdAndServiceProvider({
      userId,
      serviceProviderId
    });
    if (!mailTrapConfig) throw new NotFoundError('Configurations Not Found!');
    
    const config = { endpoint: mailTrapConfig.endpoint, token: mailTrapConfig.token }
    
    const sendMails = await sendMultipleEmail({
      recipients, 
      template, 
      variables, 
      MSProvider, 
      containsHtmlPart: mailTrapConfig.emailContainsHtmlPart, 
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
  
exports.MailService = MailService;
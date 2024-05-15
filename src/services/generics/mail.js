const { Template } = require('../../database/repositories/template.repo');
const { MailServiceProvider} = require('../../database/repositories/mailServiceProvider.repo');
const { NotFoundError, InternalServerError, ValidationError } = require('../../libs/exceptions/index');
const { sendMultipleEmail } = require('../../libs/mailer/utils');
const { checkValidVariables } = require('../../utils/index');

class GenericMailService {
  constructor(config, repository, tableName) {
    this.config = config;
    this.repository = repository;
    this.tableName = tableName;
  }
  static async sendMail({userId, recipients, variables, templateId, serviceProviderId}) {
    const template = await Template.getById(templateId);
    if (!template) throw new NotFoundError('Template Not Found!');

    const MSProvider = await MailServiceProvider.getById(serviceProviderId);
    if (!MSProvider) throw new NotFoundError(`Mail Service Provider Not Found!`);

    const isValidVariables = checkValidVariables(variables, template.personalizedVariables);
    if (isValidVariables) throw new ValidationError('Varables is Invalid!');

    const configuration = await this.repository.getbyUserIdAndServiceProvider({
      userId,
      serviceProviderId
    });
    if (!configuration) throw new NotFoundError('Configurations Not Found!');
    
    // const config = { endpoint: mailTrapConfig.endpoint, token: mailTrapConfig.token }
    
    const sendMails = await sendMultipleEmail({
      recipients, 
      template, 
      variables, 
      MSProvider, 
      containsHtmlPart: configuration.emailContainsHtmlPart, 
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
  
exports.GenericMailService = GenericMailService;
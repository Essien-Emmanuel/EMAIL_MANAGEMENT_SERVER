const { Template } = require('../../database/repositories/template.repo');
const { MailServiceProvider} = require('../../database/repositories/mailServiceProvider.repo');
const { NotFoundError, InternalServerError, ValidationError } = require('../../libs/exceptions/index');
const { sendMultipleEmail } = require('../../libs/mailer/utils');
const { MailjetConfiguration } = require('../../database/repositories/mailjetConfiguration.repo')
const { checkValidVariables } = require('../../utils/index');

class GenericMailService {
  constructor(configVariables, repository, tableName) {
    this.configVariables = configVariables;
    this.repository = repository;
    this.tableName = tableName;
  }
  getRepository() {
    switch (slug) {
      case 'mail-jet':
        return MailjetConfiguration
      default:
        break;
    }
  }

  static async sendMail({userId, recipients, variables, templateId, serviceProviderId}) {
    const template = await Template.getById(templateId);
    if (!template) throw new NotFoundError('Template Not Found!');

    const MSProvider = await MailServiceProvider.getById(serviceProviderId);
    if (!MSProvider) throw new NotFoundError(`Mail Service Provider Not Found!`);

    const repository = this.getRepository(MSProvider.slug);
    console.log('repository ', repository)

    const isValidVariables = checkValidVariables(variables, template.personalizedVariables);
    if (isValidVariables) throw new ValidationError('Varables is Invalid!');

    const configuration = await repository.getbyUserIdAndServiceProvider({
      userId,
      serviceProviderId
    });
    if (!configuration) throw new NotFoundError('Configurations Not Found!');
    
    // const config = { endpoint: mailTrapConfig.endpoint, token: mailTrapConfig.token }
    const config = {}
    for (const variable of configVariables) {
      config[variable] = configuration[variable];
    };
    console.logg('config ', config)
    return {
      success: 'ok'
    }
    const sendMails = await sendMultipleEmail({
      recipients, 
      template, 
      variables, 
      MSProvider, 
      containsHtmlPart: configuration.emailContainsHtmlPart, 
      config: this.config
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
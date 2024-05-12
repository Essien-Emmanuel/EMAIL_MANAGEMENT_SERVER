const { MailServiceProvider } = require('../../database/repositories/mailServiceProvider.repo');
const { IMailServiceProvider } = require('../../database/models/MailServiceProvider');
const { ResourceConflictError, NotFoundError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');

class MailServiceProviderService {
  static async createMSProvider(MSProviderDto) {
    const MSProvider = await MailServiceProvider.getBySlug(MSProviderDto.slug);
    if (MSProvider)  throw new ResourceConflictError('Mail Service Provider Already Exists');

    const createdMSProvider = await MailServiceProvider.create(MSProviderDto);
    if (!createdMSProvider) throw new InternalServerError('Unable to create Mail Service Provider!');
    
    const cleanedMSProviderData = cleanData(createdMSProvider._doc, IMailServiceProvider)
    return {
      statusCode: 201,
      message: 'Created Mail Service Provider Successfully',
      data: cleanedMSProviderData
    }
  }

  static async getMSProvider(id) {
    const MSProvider = await MailServiceProvider.getById(id);
    if (!MSProvider) throw new NotFoundError('Mail Service Provider Not Found');

    const cleanedMSProviderData = cleanData(MSProvider._doc, IMailServiceProvider);

    return {
      message: 'Fetched Mail Service Provider Successfully',
      data: cleanedMSProviderData
    }
  }
}

exports.MailServiceProviderService = MailServiceProviderService;
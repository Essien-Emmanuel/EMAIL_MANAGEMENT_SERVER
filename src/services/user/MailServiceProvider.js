const { MailServiceProvider } = require('../../database/repositories/mailServiceProvider.repo');
const { IMailServiceProvider } = require('../../database/models/MailServiceProvider');
const { ResourceConflictError, NotFoundError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');
const { get } = require('mongoose');

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

  static async updateMSProvider(filter, updateData) {
    const { serviceProviderId: _id} = filter;

    const MSProvider = await MailServiceProvider.getById(_id);
    if (!MSProvider) throw new NotFoundError('Mail Service Provider Not Found!');

    const updatedMSProvider = await MailServiceProvider.update({_id}, updateData);
    if (updatedMSProvider.modifiedCount !== 1) throw new InternalServerError('Unable to update mail service provider field');

    const fetchedMSProvider = await MailServiceProvider.getById(_id);
    const cleanedFetchedData = cleanData(fetchedMSProvider._doc, IMailServiceProvider);

    return {
      message: 'Updated Mail Service Provider Successfully!',
      data: cleanedFetchedData
    }
  }

  static async deleteMSProvider(_id) {
    const MSProvider = await MailServiceProvider.getById(_id);
    if (!MSProvider) throw new NotFoundError('Mail Service Provider Not Found!');

    const deletedMSProvider = await MailServiceProvider.delete(_id);
    if (deletedMSProvider.deletedCount !== 1) throw new InternalServerError('Unable to delete Mail Service Provider');

    return {
      message: 'Deleted Mail Service Provider Successfully!', 
      data: { deletedMailServiceProviderId: _id}
    }
  }
}

exports.MailServiceProviderService = MailServiceProviderService;
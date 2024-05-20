const { ProviderConfig } = require('../../database/repositories/providerConfig.repo');
const {IMailTrapCredential} = require('../../database/models/MailTrapCredential')
const { cleanData} = require('../../utils/sanitizeData');
const { NotFoundError, ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');

class MailTrapConfigService {
  static async createConfig(providerConfigDto) {
    const { userId, serviceProviderId} = providerConfigDto;
    
    const providerConfig = await ProviderConfig.getbyUserIdAndServiceProvider({userId, serviceProviderId});
    if (providerConfig) throw new ResourceConflictError('Mailtrap Credentials already exist');
    
    const createdProviderConfig = await ProviderConfig.create({
      ...credentialDto, 
      user: userId, 
      mailServiceProvider: serviceProviderId
    });
    
    if (!createdProviderConfig) throw new InternalServerError('Unable to save Mailtrap Provider Configuration');
    
    return {
      statusCode: 201,
      message: 'Saved Mailtrap Credentials Successfully!',
      data: { createdProviderConfig }
    }
  }

  static async getConfig(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Mailtrap provider Configuration Not Found!');

    return {
      message: "Fetched Mailtrap Provider Configuration Successfully!",
      data: { ProviderConfig }
    }
  }  

  static async updateCredential(filter, updateDto) {
    const {_id} = filter;

    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Mailtrap Provider Configuration Not Found!');
    
    const updatedProviderConfig = await ProviderConfig.update({_id}, updateDto);
    if (updatedProviderConfig.modifiedCount !== 1) throw new InternalServerError('Unable to update Provider Confuration field field');

    const fetchProviderConfiguration = await ProviderConfig.getById(_id);

    return {
      message: 'Updated Mailtrap Credentials Successfully!',
      data: { updatedConfig: fetchProviderConfiguration }
    }
  }

  static async deleteCredential(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Provider Configuration Not Found!');

    const deletedProviderConfig = await ProviderConfig.delete(_id);
    if (deletedProviderConfig.deletedCount !== 1) throw new InternalServerError('Unable to delete Provider Configuration!');

    return {
      message: 'Provider Configuration deleted successfully!',
      data: { deletedConfigId: _id }
    }
  }
}

exports.MailTrapCredentialService = MailTrapCredentialService;
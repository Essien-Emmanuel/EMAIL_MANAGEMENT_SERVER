const { ProviderConfig } = require('../../../database/repositories/providerConfig.repo');
const { ServiceProvider } = require('../../../database/repositories/serviceProvider.repo');
const { NotFoundError } = require('../../../libs/exceptions');

exports.getServiceProviderName = async (serviceProviderId) => {
  const serviceProvider = await ServiceProvider.getById(serviceProviderId);
  if (!serviceProvider) throw new NotFoundError('Service Provider Not Found!');
  return serviceProvider.name;
}

exports.getServiceProviderNameFromConfig = async (providerConfigId) => {
  const providerConfig = await ProviderConfig.getById(providerConfigId);
  if (!providerConfig) throw new NotFoundError('Provider Config Not Found!');
  const serviceProvider = await this.getServiceProviderName(providerConfig.service_provider);
  return serviceProvider;
}
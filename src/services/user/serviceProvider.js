const { ServiceProvider } = require('../../database/repositories/serviceProvider.repo');
const { ResourceConflictError, NotFoundError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');

class ServiceProviderService {
  static async createServiceProvider(serviceProviderDto) {
    const serviceProvider = await ServiceProvider.getByName(serviceProviderDto.name);
    if (serviceProvider)  throw new ResourceConflictError('Mail Service Provider Already Exists');

    const createdServiceProvider = await ServiceProvider.create(serviceProviderDto);
    if (!createdServiceProvider) throw new InternalServerError('Unable to create Mail Service Provider!');
    
    return {
      statusCode: 201,
      message: 'Created Mail Service Provider Successfully',
      data: { createdServiceProvider }
    }
  }

  static async getServiceProvider(id) {
    const serviceProvider = await ServiceProvider.getById(id);
    if (!serviceProvider) throw new NotFoundError('Mail Service Provider Not Found');

    return {
      message: 'Fetched Mail Service Provider Successfully',
      data: { serviceProvider }
    }
  }

  static async updateServiceProvider(filter, updateData) {
    const { serviceProviderId: _id} = filter;

    const ServiceProvider = await ServiceProvider.getById(_id);
    if (!ServiceProvider) throw new NotFoundError('Mail Service Provider Not Found!');

    const updatedServiceProvider = await ServiceProvider.update({_id}, updateData);
    if (updatedServiceProvider.modifiedCount !== 1) throw new InternalServerError('Unable to update mail service provider field');

    const fetchedServiceProvider = await ServiceProvider.getById(_id);

    return {
      message: 'Updated Mail Service Provider Successfully!',
      data: { fetchedServiceProvider }
    }
  }

  static async deleteServiceProvider(_id) {
    const ServiceProvider = await ServiceProvider.getById(_id);
    if (!ServiceProvider) throw new NotFoundError('Mail Service Provider Not Found!');

    const deletedServiceProvider = await ServiceProvider.delete(_id);
    if (deletedServiceProvider.deletedCount !== 1) throw new InternalServerError('Unable to delete Mail Service Provider');

    return {
      message: 'Deleted Mail Service Provider Successfully!', 
      data: { deletedServiceProviderId: _id}
    }
  }
}

exports.ServiceProviderService = ServiceProviderService;
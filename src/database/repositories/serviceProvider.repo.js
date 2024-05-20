const { ServiceProviderModel } = require('../models/ServiceProvider');
const { GenericRepo } = require('./generic/index');

class ServiceProviderRepo extends GenericRepo {
  constructor(model) {
    super(model)
  }

  getByName(name) {
    return this.model.findOne({ name });
  }
}

const ServiceProvider = new ServiceProviderRepo(ServiceProviderModel);

exports.ServiceProvider = ServiceProvider;
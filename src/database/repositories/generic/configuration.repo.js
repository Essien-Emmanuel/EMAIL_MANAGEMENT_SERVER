const { GenericRepo } = require('./index');

class GeneralConfigRepo extends GenericRepo {
  constructor(model) {
    super(model);
  }
  getbyUserIdAndServiceProvider({userId, serviceProviderId}) {
    return this.model.findOne({ user: userId, serviceProvider: serviceProviderId})
  }
}

exports.GeneralConfigRepo = GeneralConfigRepo;
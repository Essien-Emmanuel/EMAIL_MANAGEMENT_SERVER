const { MailServiceProvider } = require('../../database/repositories/mailServiceProvider.repo');
const { ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');
const { GenericService } = require('./index');

class GenericConfigService extends GenericService {
  constructor(repository, $interface, tableName) {
    super(repository, $interface, tableName);
  }

  async createRecord(payload) {
    const { userId, serviceProviderId} = payload;

    const record = await this.repository.getbyUserIdAndServiceProvider({userId, serviceProviderId});

    if (record)  throw new ResourceConflictError(`${this.tableName} Already Exist!`);

    const createdRecord = await this.repository.create({
      ...payload, 
      user: userId, 
      mailServiceProvider: serviceProviderId 
    });
    if (!createdRecord) throw new InternalServerError(`Unable to create ${this.tableName}!`);
    
    const cleanedData = cleanData(createdRecord._doc, this.$interface)
    return {
      statusCode: 201,
      message: `Created ${this.tableName} Successfully`,
      data: cleanedData
    }
  }
}

exports.GenericConfigService = GenericConfigService;
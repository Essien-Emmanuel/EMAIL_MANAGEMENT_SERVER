const { ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');
const { GenericService } = require('./index');

class GenericConfigService extends GenericService {
  constructor(repository, $interface, tableName) {
    super(repository, $interface, tableName);
  }

  async createRecord(payload) {
    const record = await this.repository.getBySlug(payload.slug);
    if (record)  throw new ResourceConflictError(`${this.tableName} Already Exist!`);

    const createdRecord = await this.repository.create(payload);
    if (!createdRecord) throw new InternalServerError(`Unable to create ${this.tableName}!`);
    
    const cleanedMSProviderData = cleanData(createdRecord._doc, this.$interface)
    return {
      statusCode: 201,
      message: 'Created Mail Service Provider Successfully',
      data: cleanedMSProviderData
    }
  }
}

exports.GenericConfigService = GenericConfigService;
const { NotFoundError, InternalServerError } = require('../../libs/exceptions/index');
const { cleanData } = require('../../utils/sanitizeData');

class GenericService {
  constructor(repository, $interface, tableName) {
    this.repository = repository;
    this.tableName = tableName;
    this.$interface = $interface
  }

  async createRecord(payload) {}

  async getRecord(_id) {
    const record = await this.repository.getById(id);
    if (!record) throw new NotFoundError(`${this.tableName} Not found!`);

    const cleanRecord = cleanData(record._doc, this.$interface);

    return {
      message: `Fetched ${this.tableName} Successfully`,
      data: cleanRecord
    }
  }

  async updateRecord(filter, updateData) {
    const {_id} = filter;

    const record = await this.repository.getById(_id);
    if (!record) throw new NotFoundError(`${this.tableName} Not found!`);

    const updateRecord = await this.repository.update({_id}, updateData);
    if (updateRecord.modifiedCount !== 1) throw new InternalServerError(`Unable to update ${this.tableName} record!`);

    const fetchedRecord = await this.repository.getById(_id);
    const cleanedFetchedData = cleanData(fetchedRecord._doc, this.$interface);

    return {
      message: `Updated ${this.tableName} Successfully!`,
      data: cleanedFetchedData
    }
  }

  async deleteRecord(_id) {
    const record = await this.repository.getById(_id);
    if (!record) throw new NotFoundError(`${this.tableName} Not found!`);

    const deletedRecord = await this.repository.delete(_id);
    if (deletedRecord.deletedCount !== 1) throw new InternalServerError(`Unable to update ${this.tableName} record!`);

    return {
      message: `Deleted ${this.tableName} Successfully!`, 
      data: { deletedRecordId: _id}
    }
  }
}

exports.GenericService = GenericService;
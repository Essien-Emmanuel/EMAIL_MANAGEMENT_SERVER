const {
  ProviderConfig,
} = require("../../database/repositories/providerConfig.repo");
const {
  ServiceProvider,
} = require("../../database/repositories/serviceProvider.repo");
const { DatabaseTableName } = require("../../enums");
const {
  NotFoundError,
  ResourceConflictError,
  InternalServerError,
} = require("../../libs/exceptions/index");
const { normalizeStrToPascalCase } = require("../../utils");
const { mapDtoToTableFields } = require("../utils");

const providersWithHtmlPart = ["mailjet"];

class ProviderConfigService {
  static async createProviderConfig(providerConfigDto) {
    const { userId, serviceProviderId } = providerConfigDto;

    const serviceProvider = await ServiceProvider.getById(serviceProviderId);
    if (!serviceProvider) throw new NotFoundError("Service provider not found");

    const providerConfig = await ProviderConfig.getbyUserIdAndServiceProvider({
      userId,
      serviceProviderId,
    });
    if (providerConfig)
      throw new ResourceConflictError("Provider Configuration already exist");

    const is_htmlPart = providersWithHtmlPart.includes(serviceProvider.name)
      ? true
      : false;

    const createdProviderConfig = await ProviderConfig.create({
      ...providerConfigDto,
      email_contains_html_part: is_htmlPart,
      user: userId,
      serviceProvider: serviceProviderId,
    });

    if (!createdProviderConfig)
      throw new InternalServerError("Unable to save Provider Configuration");

    return {
      statusCode: 201,
      message: "Saved Provider Configuration Successfully!",
      data: { createdProviderConfig },
    };
  }

  static async getProviderConfig(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig)
      throw new NotFoundError("Provider Configuration Not Found!");

    return {
      message: "Fetched Provider Configuration Successfully!",
      data: { providerConfig },
    };
  }

  static async updateProviderConfig(filter, updateDto) {
    const { _id } = filter;

    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig)
      throw new NotFoundError("Provider Configuration Not Found!");

    let domainName;
    if (updateDto.domainName) {
      domainName = normalizeStrToPascalCase(updateDto.domainName);
    }

    const updateData = mapDtoToTableFields(DatabaseTableName.PROVIDER_CONFIG, {
      ...updateDto,
      domainName,
    });

    const updatedProviderConfig = await ProviderConfig.update(
      { _id },
      updateData
    );
    if (updatedProviderConfig.modifiedCount !== 1)
      throw new InternalServerError(
        "Unable to update Provider Confuration field field"
      );

    const fetchProviderConfiguration = await ProviderConfig.getById(_id);

    return {
      message: "Updated Provider Configurations Successfully!",
      data: { updatedConfig: fetchProviderConfiguration },
    };
  }

  static async deleteProviderConfig(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig)
      throw new NotFoundError("Provider Configuration Not Found!");

    const deletedProviderConfig = await ProviderConfig.delete(_id);
    if (deletedProviderConfig.deletedCount !== 1)
      throw new InternalServerError("Unable to delete Provider Configuration!");

    return {
      message: "Provider Configuration deleted successfully!",
      data: { deletedConfigId: _id },
    };
  }
}

exports.ProviderConfigService = ProviderConfigService;

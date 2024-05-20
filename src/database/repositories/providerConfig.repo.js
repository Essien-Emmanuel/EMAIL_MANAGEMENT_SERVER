const { GeneralConfigRepo } = require('./generic/configuration.repo');
const { ProviderConfigModel } = require('../models/ProviderConfig');

const ProviderConfig = new GeneralConfigRepo(ProviderConfigModel);

exports.ProviderConfig = ProviderConfig;
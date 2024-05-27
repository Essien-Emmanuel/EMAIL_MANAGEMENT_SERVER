const { getServiceProviderName, getServiceProviderNameFromConfig } = require('./utils');
const { getConfigPropSchema } = require('./configSchema');
const { idSchemaValue } = require('..');

exports.createProviderConfigSchema = async (req, _res, next) => {
  const serviceProviderName = await getServiceProviderName(req.query.serviceProviderId);
  const configPropSchema = getConfigPropSchema(serviceProviderName);
  schema = {
    config: {
      type: "object",
      props: {...configPropSchema}
    }
  }
  req.schema = {...schema };
  req.input = { ...req.body, };
  next();
}

exports.updateProviderConfigSchema = async (req, _res, next) => {
  const serviceProviderName = await getServiceProviderNameFromConfig(req.query.providerConfigId);
  const configPropSchema = getConfigPropSchema(serviceProviderName);
  const schema = {
    config: {
      type: "object",
      props: {...configPropSchema}
    }
  } 
  req.schema = {...schema };
  req.input = { ...req.body, };
  next();
}

exports.createProviderConfigIdSchema = (req, _res, next) => {
  const schema = {
    userId: idSchemaValue,
    serviceProviderId: idSchemaValue,
  }
  req.schema = {...schema};
  req.input = { 
    userId: req.query.userId, 
    serviceProviderId: req.query.serviceProviderId
  }
  next();
}

exports.providerConfigIdSchema = (req, _res, next) => {
  req.schema = { providerConfigId: idSchemaValue };
  req.input = { providerConfigId: req.query.providerConfigId }
  next()
}
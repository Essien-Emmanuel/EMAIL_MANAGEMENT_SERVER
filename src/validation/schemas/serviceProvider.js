const { idSchemaValue } = require(".");

exports.createServiceProviderSchema = (req) => {
  const schema = {
    name: { type: 'string'}
  }
  req.schema = schema;
  req.input = req.body;
}

exports.updateServiceProviderSchema = (req) => {
  const schema = {
    name: {type: 'string'},
    serviceProviderId: idSchemaValue 
  }
  req.schema = schema;
  req.input = {
    ...req.body, 
    serviceProviderId: req.query.serviceProviderId
  }
}

exports.serviceProviderIdSchema = (req) => {
  req.schema = { serviceProviderId: idSchemaValue };
  req.input = { serviceProviderId: req.query.serviceProviderId}
}
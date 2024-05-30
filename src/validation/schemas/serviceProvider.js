const { idSchemaValue } = require(".");

exports.createServiceProviderSchema = (req, _res, next) => {
  const schema = {
    name: { type: 'string'}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();
}

exports.updateServiceProviderSchema = (req, _res, next) => {
  const schema = {
    name: {type: 'string'},
  }
  req.schema = {...schema};
  req.input = {
    ...req.body, 
  }
  next();
}

exports.serviceProviderIdSchema = (req, _res, next) => {
  req.schema = { serviceProviderId: idSchemaValue };
  req.input = { serviceProviderId: req.query.serviceProviderId};
  next();
}
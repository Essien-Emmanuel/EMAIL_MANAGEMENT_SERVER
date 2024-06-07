const { idSchemaValue } = require(".")

exports.saveRecipientsByTagIdSchema = (req, _res, next) => {
  const schema = {
    recipients: { type: 'array', items: { type: 'email'}}
  }
  req.schema = schema;
  req.input = { ...req.body }
  next()
}

exports.recipientIdSchema = (req, _res, next) => {
  req.schema = { recipientId: idSchemaValue };
  req.input = { recipientId: req.query.recipientId};
  console.log(req.input)
  next();
}
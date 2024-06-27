const { idSchemaValue } = require(".");

exports.createListSchema = (req, _res, next) => {
  const schema = {
    tag_name: { type: 'string'},
    slug: {type: 'string'}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}

exports.updateListSchema = (req, _res, next) => {
  const schema = {
    tag_name: { type: 'string', optional: true},
    slug: {type: 'string', optional: true}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}

exports.ListIdSchema = (req, _res, next) => {
  req.schema = { tagId: idSchemaValue };
  req.input = { tagId: req.query.tagId};
  next();
}
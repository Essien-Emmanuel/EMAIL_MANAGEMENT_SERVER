exports.createTagSchema = (req, _res, next) => {
  const schema = {
    tag_name: { type: 'string'},
    slug: {type: 'string'},
    emailRecipients: { type: "array", items: { 
      type: 'object', props: { email: { type: "email" } }
    }, optional: true}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}

exports.updateTagSchema = (req, _res, next) => {
  const schema = {
    tagName: { type: 'string', optional: true},
    slug: {type: 'string', optional: true},
    emailRecipients: { type: "array", items: { 
      type: 'object', props: { email: { type: "email" } }
    }, optional: true}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}

exports.tagIdSchema = (req, _res, next) => {
  req.schema = { tagId: idSchemaValue };
  req.input = { tagId: req.query.tagId};
  next();
}
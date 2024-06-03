exports.createTagSchema = (req, _res, next) => {
  const schema = {
    tagName: { type: 'string'},
    slug: {type: 'string'},
    emailRecipients: { type: "arrary", items: { 
      type: 'object', props: { emaail: { type: "email" } }
    }, optional: true}
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}
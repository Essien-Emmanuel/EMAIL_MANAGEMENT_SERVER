exports.createTagSchema = (req, _res, next) => {
  const schema = {
    tagName: { type: 'string'},
    slug: {type: 'string'},
  }
  req.schema = {...schema};
  req.input = req.body;
  next();

}
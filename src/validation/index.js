const Validator = require('fastest-validator');
const { ValidationError } = require('../libs/exceptions');

exports.validateInput = function(req, _res, next) {
  const validator = new Validator();
 
  const check = validator.compile(req.schema);
  const errors = check(req.input);
  
  if (errors.length > 0) throw new ValidationError('Invalid Input!', errors);
  
  next();
}
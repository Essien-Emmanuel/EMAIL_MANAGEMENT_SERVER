const defineResponse = require('./defineResponse');

function defineController({ controller }) {
  return async function(req, res, next) {
    try {
      req.return = (data) => res.json(defineResponse(data));
      return await controller(req, res, next)
      
    } catch (error) {
      next(error)
    }
  } 
}

module.exports = defineController;
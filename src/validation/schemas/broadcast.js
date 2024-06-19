const { idSchemaValue } = require(".");
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

exports.sendBroadcastSchema = (req, _res, next) => {
  const schema = {
    email: { type: 'string'},
    subject: { type: 'string'},
    sendingFrom: { type: 'array', items: {
        type: "object", props: {
            name: { type: "string" },
            email: { type: "email" }
        }, default: [{}]} 
    },
    sendingTo: { type: "array",  items: { type: "object", props: {
            _id: {
                type: 'string',
                pattern: objectIdPattern,
                optional: true,
                messages: {
                    stringPattern: "The '_id' field must be a valid Mongoose ObjectId"
                }
            },
        }}, default: [{}] ,   
    },
    scheduledTime: { type: 'date', optional: true },
    publishStatus: { type: 'boolean', defalut: false}
  }
  req.schema = schema;
  req.input = { ...req.body }
  next()
}

exports.userIdSchema = (req, _res, next) => {
  req.schema = { userId: idSchemaValue };
  req.input = { userId: req.query.userId};
  next();
}
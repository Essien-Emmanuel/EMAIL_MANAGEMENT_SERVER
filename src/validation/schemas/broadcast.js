const { idSchemaValue } = require(".")

// ({email, subject, sendingFrom = [], sendingTo = [], scheduledTime = null, publicStatus }) {
    //get the sent to, e.g {} or { _id: Schema.Types.ObjectId }
    // sendingFrom: [ { name, email }]

exports.sendBroadcastSchema = (req, _res, next) => {
  const schema = {
    email: { type: 'string'},
    sendingFrom: { type: 'array', items: { type: '_id'} },
    sendingTo: { type: "array", items: {
        type: "object", props: {
            name: { type: "string" },
            email: { type: "email" }
        }} 
    },
    scheduledTime: { type: 'date', optional: true },
    publishStatus: { type: 'boolean', defalut: false}
  }
  req.schema = schema;
  req.input = { ...req.body }
  next()
}

exports.recipientIdSchema = (req, _res, next) => {
  req.schema = { recipientId: idSchemaValue };
  req.input = { recipientId: req.query.recipientId};
  next();
}
const { Schema, model } = require("mongoose");

const EmailFailureSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
  },
  failure_reason: { type: String,  required: true}
}, { timestamps: true} );

exports.EmailFailureModel = model('EmailFailure', EmailFailureSchema);

const { Schema, model } = require("mongoose");

const BroadcastFailureSchema = new Schema({
  broadcast: {
    type: Schema.Types.ObjectId,
    ref: 'Broadcast'
  },
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: 'Subscriber'
  },
  failure_reason: String
}, { timestamps: true} );

exports.BroadcastFailureModel = model('BroadcastFailure', BroadcastFailureSchema);

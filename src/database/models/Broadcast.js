const { Schema, model } = require('mongoose');

const BroadCastSchema = new Schema({
  subject: String,
  from: [ {
    name: String,
    email: { type: String, trim: true, required: true}
  }],
  subscribers: [{
    type: Schema.Types.ObjectId, 
    ref: 'Subscriber' 
  }],
  total_subscribers: Number,
  publish_status: { type: Boolean, default: false},
  publish_date: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true });



exports.BroadcastModel = model('Broadcast', BroadCastSchema);
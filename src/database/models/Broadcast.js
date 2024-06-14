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

// BroadCastSchema.pre('save', function(next) {
//   this.subscriber_length = this.subscribers.length;
//   this.updated_at = Date.now();
//   next();
// });

// BroadCastSchema.pre('findOneAndUpdate', function(next) {
//   if (this._update.subscribers) {
//       this._update.subscriber_length = this._update.subscribers.length;
//   }
//   this._update.updated_at = Date.now();
//   next();
// });
// BroadCastSchema.pre('update', function(next) {
//   if (this._update.subscribers) {
//       this._update.subscriber_length = this._update.subscribers.length;
//   }
//   this._update.updated_at = Date.now();
//   next();
// });

exports.BroadcastModel = model('Broadcast', BroadCastSchema);
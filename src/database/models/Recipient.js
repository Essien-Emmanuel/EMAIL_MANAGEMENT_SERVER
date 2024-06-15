const { Schema, model } = require('mongoose');
const { SubscripitonRequestEnum } = require('../enums/index');
const ReciepientSchema = new Schema({
  email: { type: 'string', trim: true },
  is_confirmed: { type: Boolean, default: false },
  subscription_request: { 
    type: String, 
    enum: Object.values(SubscripitonRequestEnum)
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

exports.recipientModel = model('Recipient', ReciepientSchema); 
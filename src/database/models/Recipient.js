const { Schema, model } = require('mongoose');

const ReciepientSchema = new Schema({
  email: { type: 'string', trim: true },
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  }
}, { timestamps: true });

exports.recipientModel = model('Recipient', ReciepientSchema); 
const { Schema, model } = require('mongoose');

const ReciepientSchema = new Schema({
  recipient: { type: 'string', trim: true, unique: true },
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  }
}, { timestamps: true });

exports.recipientModel = model('Recipient', ReciepientSchema); 
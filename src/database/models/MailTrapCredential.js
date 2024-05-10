const { Schema, model } = require('mongoose');

const MailTrapCredentailSchema = new Schema({
  token: {type: String},
  endpoint: { type: String},
  user: { type: String, required: true, ref: 'User'}
}, { timestamps: true});

exports.MailTrapCredentail = model('MailTrapCredential', MailTrapCredentailSchema);
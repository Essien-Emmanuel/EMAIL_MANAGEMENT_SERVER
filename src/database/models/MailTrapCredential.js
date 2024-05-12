const { Schema, model } = require('mongoose');

exports.IMailTrapCredentialSchema = {
  token: 'string',
  endpoint: 'string',
  user: 'object',
  createdAt: 'string',
  updatedAt: 'string,'
}

const MailTrapCredentailSchema = new Schema({
  token: {type: String},
  endpoint: { type: String},
  user: { type: String, required: true, ref: 'User'},
  mailServiceProvider: { type: String, required: true, ref: 'MailServiceProvider'}
}, { timestamps: true});

exports.MailTrapCredentail = model('MailTrapCredential', MailTrapCredentailSchema);
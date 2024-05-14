const { Schema, model } = require('mongoose');

exports.IMailTrapCredential = {
  _id: 'string',
  token: 'string',
  endpoint: 'string',
  emailContainsHtmlPart: 'boolean',
  user: 'object',
  mailServiceProvider: 'object',
  createdAt: 'string',
  updatedAt: 'string,'
}

const MailTrapCredentailSchema = new Schema({
  token: {type: String},
  endpoint: { type: String},
  emailContainsHtmlPart: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  mailServiceProvider: { type: String, required: true, ref: 'MailServiceProvider'}
}, { timestamps: true});

exports.MailTrapCredential = model('MailTrapCredential', MailTrapCredentailSchema);
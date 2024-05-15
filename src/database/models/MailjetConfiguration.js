const { Schema, model } = require('mongoose');

exports.IMailjetConfiguration = {
  _id: 'string',
  apiKey: 'string',
  apiSecret: 'string',
  emailContainsHtmlPart: 'boolean',
  user: 'object',
  mailServiceProvider: 'object',
  createdAt: 'string',
  updatedAt: 'string,'
}

const MailjetConfigurationSchema = new Schema({
  apiKey: {type: String},
  apiSecret: { type: String},
  emailContainsHtmlPart: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  mailServiceProvider: { type: String, required: true, ref: 'MailServiceProvider'}
}, { timestamps: true});

exports.MailjetConfigurationModel = model('MailjetConfiguration', MailjetConfigurationSchema);
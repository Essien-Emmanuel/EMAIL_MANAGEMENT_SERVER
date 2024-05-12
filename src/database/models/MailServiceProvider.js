const { Schema, model } = require('mongoose');

exports.IMailServiceProvider = {
  _id: 'string',
  name: 'string',
  slug: 'string',
  createdAt: 'string',
  updatedAt: 'string'
}

const MailServiceProviderSchema = new Schema({
  name: {type: String},
  slug: { type: String },
}, {timestamps: true });

exports.MailServiceProviderModel = model('MailServiceProvider', MailServiceProviderSchema);
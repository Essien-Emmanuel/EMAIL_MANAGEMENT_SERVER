const { Schema, model } = require('mongoose');

exports.IProviderConfig = {
  _id: 'string',
  token: 'string',
  endpoint: 'string',
  emailContainsHtmlPart: 'boolean',
  user: 'object',
  mailServiceProvider: 'object',
  createdAt: 'string',
  updatedAt: 'string,'
}

const ProviderConfigSchema = new Schema({
  config: { type: Object},
  emailContainsHtmlPart: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  serviceProvider: { type: String, required: true, ref: 'ServiceProvider'}
}, { timestamps: true});

exports.ProviderConfigModel = model('ProviderConfig', ProviderConfigSchema);
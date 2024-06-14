const { Schema, model } = require('mongoose');

const ProviderConfigSchema = new Schema({
  config: { type: Object},
  emailContainsHtmlPart: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  serviceProvider: { type: String, required: true, ref: 'ServiceProvider'}
}, { timestamps: true});

exports.ProviderConfigModel = model('ProviderConfig', ProviderConfigSchema);
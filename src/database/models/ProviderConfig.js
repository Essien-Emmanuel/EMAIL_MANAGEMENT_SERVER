const { Schema, model } = require('mongoose');

const ProviderConfigSchema = new Schema({
  domain_email: String,
  config: { type: Object},
  email_contains_html_part: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  service_provider: { type: String, required: true, ref: 'ServiceProvider'}
}, { timestamps: true});

exports.ProviderConfigModel = model('ProviderConfig', ProviderConfigSchema);
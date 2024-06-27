const { Schema, model } = require('mongoose');

const ProviderConfigSchema = new Schema({
  domain_name: {type: String, required: true},
  domain_email: { type: String, required: true },
  config: { type: Object, required: true},
  email_contains_html_part: { type: Boolean, default: true},
  user: { type: String, required: true, ref: 'User'},
  service_provider: { type: String, required: true, ref: 'ServiceProvider'}
}, { timestamps: true});

exports.ProviderConfigModel = model('ProviderConfig', ProviderConfigSchema);
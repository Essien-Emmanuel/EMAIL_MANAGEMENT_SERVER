const { Schema, model } = require('mongoose');

exports.IServiceProvider = {
  _id: 'string',
  name: 'string',
  createdAt: 'string',
  updatedAt: 'string'
}

const ServiceProviderSchema = new Schema({
  name: {type: String},
}, {timestamps: true });

exports.ServiceProviderModel = model('ServiceProvider', ServiceProviderSchema);
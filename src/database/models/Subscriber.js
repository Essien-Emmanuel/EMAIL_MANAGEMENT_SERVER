const { Schema, model} = require('mongoose');

const SubscriberSchema = new Schema({
  recipient: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipient'
  }]
})
const { Schema, model } = require('mongoose');

const ListSchema = new Schema({
  name: { type: String, trim: true, unique: true },
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: "Subscriber"
  }],
  user: { 
    type: Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  }
}, { timestamps: true });

exports.ListModel = model('List', ListSchema);
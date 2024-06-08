const { Schema, model } = require('mongoose');

exports.ITag = {
  slug: 'string',
  tag_name: 'string',
  recipients: 'array',
  user: "string"
}

const recipientSchema = new Schema({
  email: { type: String, trim: true, required: true},
}, {timestamps: true})

const TagSchema = new Schema({
  slug: { type: String, trim: true, unique: true },
  tag_name: { type: String, trim: true, unique: true },
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: "Recipient"
  }],
  user: { 
    type: Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  }
}, { timestamps: true });

exports.TagModel = model('Tag', TagSchema);
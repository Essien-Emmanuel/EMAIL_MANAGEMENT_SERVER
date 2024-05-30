const { Schema, model } = require('mongoose');

exports.IEmailTag = {
  slug: 'string',
  tagName: 'string',
  emails: 'array',
  user: "string"
}

const recipientSchema = new Schema({
  email: { type: String, trim: true, required: true},
}, {timestamps: true})

const EmailTagSchema = new Schema({
  slug: { type: String, trim: true, unique: true },
  tagName: { type: String, trim: true, unique: true },
  emailRecipients: [ recipientSchema ],
  user: { 
    type: Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
  }
}, { timestamps: true });

exports.EmailTagModel = model('EmailTag', EmailTagSchema);
const { Schema, model } = require('mongoose');

const TemplateSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true},
  subject: { type: String, required: true, trim: true}, 
  greeting: { type: String, trim: true}, 
  htmlPart: { type: String, required: true, trim: true},
  text: { type: String, required: true, trim: true }, 
  personalizedVariables: [{type: String, trim: true}],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true });

exports.Template = model('Template', TemplateSchema);
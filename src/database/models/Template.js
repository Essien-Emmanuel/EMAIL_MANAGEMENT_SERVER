const { Schema, model } = require('mongoose');

const TemplateSchema = new Schema({
  name: { type: String, trim: true, required: true },
  subject_line: { type: String, required: true, trim: true}, 
  text_content: { type: String, required: true, trim: true},
  html_content: { type: String, required: true, trim: true }, 
  personalized_variables: {
    type: [{type: String, trim: true}],
    default: []
  },
  personalized_greeting: { type: String, trim: true, required: false}, 
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true });

exports.Template = model('Template', TemplateSchema);
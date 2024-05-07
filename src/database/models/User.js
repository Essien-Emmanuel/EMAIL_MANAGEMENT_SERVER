const { Schema, model } = require('mongoose');
const { OTPSTATUS } = require('../../enums');

const UserSchema = new Schema({
  email: { type: String, required: true, trim: true, unique: true},
  password: { type: String},
  otp: { type: String },
  otp_status: { type: String, enum: Object.values(OTPSTATUS), default: OTPSTATUS.INACTIVE },
  otp_expiry_date: { type: Date}
}, {timestamps: true });

module.exports = model('User', UserSchema)
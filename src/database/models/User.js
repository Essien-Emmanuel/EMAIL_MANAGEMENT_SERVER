const { Schema, model } = require('mongoose');
const { OTPSTATUS } = require('../../enums');

exports.IUser = {
  _id: 'string',
  email: 'string',
  password: 'string',
  otp: 'string',
  otp_status: 'string',
  otp_expiry_date: 'string',
  createdAt: 'string',
  updatedAt: 'string'
}

const UserSchema = new Schema({
  email: { type: String, required: true, trim: true, unique: true},
  password: { type: String},
  otp: { type: String },
  otp_status: { type: String, enum: Object.values(OTPSTATUS), default: OTPSTATUS.INACTIVE },
  otp_expiry_date: { type: Date},
  tag: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "EmailTag"
  }
}, {timestamps: true });

exports.User = model('User', UserSchema)
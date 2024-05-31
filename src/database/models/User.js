const { Schema, model } = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
const omitCommonFields = require('mongoose-omit-common-fields');

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

UserSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    console.log('here')
    console.log('transforming user ', ret)
    delete ret.otp;
    delete ret.password;
    delete ret.otp_status;
    console.log('ret ', ret)
    // You can add or remove fields to omit as needed
    return ret;
  }
};

exports.User = model('User', UserSchema)
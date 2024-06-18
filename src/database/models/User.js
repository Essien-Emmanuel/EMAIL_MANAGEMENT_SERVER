const { Schema, model } = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
const omitCommonFields = require('mongoose-omit-common-fields');

const { OTPSTATUS } = require('../../enums');

const UserSchema = new Schema({
  email: { type: String, required: true, trim: true, unique: true},
  password: { type: String},
  otp: { type: String },
  otp_status: { type: String, enum: Object.values(OTPSTATUS), default: OTPSTATUS.INACTIVE },
  otp_expiry_date: { type: Date},
  lists:[ {
    type: Schema.Types.ObjectId,
    ref: "List"
  }]
}, {timestamps: true });

UserSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.otp;
    delete ret.password;
    delete ret.otp_status;
    delete ret.otp_expiry_date;
    return ret;
  }
};

exports.User = model('User', UserSchema)
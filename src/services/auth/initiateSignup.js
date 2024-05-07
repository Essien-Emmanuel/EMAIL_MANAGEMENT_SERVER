const User = require('../../database/repositories/user.repo');
const UserService = require('../auth/index');
const OTPValidator = require('../../utils/otpValidator');
const { hashString, generateJwt } = require('../../utils/index');
const { generateToken } = require('../../utils/tokenGeneration');
const { OTPSTATUS, TokenFlag } = require('../../enums');
const { ResourceConflictError } = require('../../libs/exceptions/index');

module.exports = async (signupDto) => {
  const { email, password } = signupDto;

  const user  = await User.getByEmail(email);
  if (user) throw new ResourceConflictError('User already exist');

  const hashedPassword = await hashString(password);

  const otp = await generateToken();
  const hashedOtp = await hashString(otp);
  
  const otpExpiryTime = OTPValidator.generateOTPExpiryTime(30)

  const createdUser = await UserService.createUser({email, password: hashedPassword, otp: hashedOtp, otp_status: OTPSTATUS.PENDING, otp_expiry_date: otpExpiryTime});

  const token = await generateJwt({email});

  //return data
  return {
    data: { createdUser: { ...createdUser._doc, password: 'hidden'}, 
    token: { 
      flag: TokenFlag.AUTH,
      value: token
    }}
  }
}
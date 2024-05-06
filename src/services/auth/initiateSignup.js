const User = require('../../database/repositories/user.repo');
const { hashString } = require('../../utils/index');
const { generateToken } = require('../../utils/tokenGeneration');

module.exports = async (signupDto) => {
  const { email, password } = signupDto;
  const user  = await User.getByEmail(email);
  if (user) throw new Error('User already exist');

  //hash password
  const hashedPassword = await hashString(password);

  //generate otp
  const otp = await generateToken();
  const hashedOtp = await hashString(otp);
  console.log('otp ', password, hashedPassword, otp, hashedOtp)
  return 
  //create user
  //generate token
  //return data
}
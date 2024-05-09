const {User} = require('../../database/repositories/user.repo');
const {
	NotFoundError,
	ServiceError,
	ValidationError,
	AuthenticationError,
	InternalServerError,
} = require('../../libs/exceptions/index');
const { OTPSTATUS } = require('../../enums');
const OTPValidator =  require("../../utils/otpValidator");
const { TokenFlag } = require("../../enums");
const { generateJwt } = require("../../utils/index");

module.exports =  async ({email, otpToken}) => {
	const user = await User.getByEmail(email);
	if (!user) throw new NotFoundError("User Not Found!");

	if (user.otp_status === OTPSTATUS.ACTIVE) throw new ServiceError("OTP Already Verified!");

	const isValidOTP = await OTPValidator.isValidOTP(otpToken, user?.otp, user?.otp_expiry_date);

	if ("expired" in isValidOTP) {
		await User.update({ _id: user?._id }, { otpStatus: OTPSTATUS.EXPIRED });
		throw new AuthenticationError(isValidOTP.msg);
	}

	if ("isOtp" in isValidOTP && !isValidOTP.isOtp) throw new ValidationError("Incorrect OTP!");

	const updatedUser = await User.update({ _id: user?._id }, { otp_status: OTPSTATUS.ACTIVE });
	if (!updatedUser) throw new InternalServerError("Updating User Failed!");

	const token = await generateJwt({
		userId: user?._id,
		flag: TokenFlag.AUTH,
		timestamp: Date.now(),
	});

	const getUpdatedUser = await User.getById(user._id);

	return {
		message: "congratulations! OTP verified sucessfully",
		data: {
			...getUpdatedUser._doc,
			password: "hidden",
			otp: "hidden",
			token: {
				flag: TokenFlag.AUTH,
				value: token,
			},
		},
	};
}

const { compareStrings, hashString } = require("./index");

class OTPValidator {
	static generateOTPExpiryTime(duration = 20) {
		const currentTime = new Date();
		const otpExpiryTime = new Date(currentTime.getTime() + duration * 60 * 1000);
		return otpExpiryTime;
	}

	static async isValidOTP(inputOtp, storedOtp, expiryTime) {
		const currentTime = new Date();
		const isValidTime = expiryTime > currentTime;

		if (!isValidTime) return { expired: true, msg: "Otp has Expired" };
		const isOtp = await compareStrings(inputOtp, storedOtp);

		if (!isOtp) return { isOtp: false, msg: "OTP token do not match!" };
		return { isOtp };
	}
}

module.exports = OTPValidator;

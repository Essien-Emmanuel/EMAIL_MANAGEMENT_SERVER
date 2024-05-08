const User = require("../../database/repositories/user.repo");
const { NotFoundError, ValidationError } = require('../../libs/exceptions/index');
const { compareStrings, generateJwt } = require('../../utils/index');
const { TokenFlag } = require('../../enums');

module.exports = async (userLoginFields) => {
	const { email, password } = userLoginFields;

	const user = await User.getByEmail(email);
	if (!user) throw new NotFoundError("No user found!");

	const matchedPassword = await compareStrings(password, user.password);
	if (!matchedPassword) throw new ValidationError("Incorrect Password!");

	const token = await generateJwt({
		_id: user._id,
		flag: TokenFlag.AUTH,
		timestamp: Date.now(),
	});

	return {
		message: "User Logged in Successfully",
		data: {
			...user._doc,
			password: "hidden",
			otp: 'hidden',
			token: {
				flag: TokenFlag.AUTH,
				value: token,
			},
		},
	};
}


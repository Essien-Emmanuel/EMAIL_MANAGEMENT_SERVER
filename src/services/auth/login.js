const {User} = require("../../database/repositories/user.repo");
const { IUser } = require('../../database/models/User')
const { NotFoundError, ValidationError } = require('../../libs/exceptions/index');
const { compareStrings, generateJwt } = require('../../utils/index');
const { TokenFlag } = require('../../enums');
const { cleanData } = require('../../utils/sanitizeData')


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

	const cleanedUserData = cleanData({...user._doc}, IUser)
		return {
		message: "User Logged in Successfully",
		data: {
			...cleanedUserData,
			token: {
				flag: TokenFlag.AUTH,
				value: token,
			},
		},
	};
}


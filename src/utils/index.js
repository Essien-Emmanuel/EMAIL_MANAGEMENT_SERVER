const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Config = require('../config');

const { salt, secret } = Config.app;

exports.isObject = (data) => { return typeof data === 'object' }


exports.generateJwt = (payload) => {
	const expirationTime = "720h";

	return new Promise((resolve, reject) => {
		jwt.sign(payload, secret, { expiresIn: expirationTime }, (error, token) => {
			if (error) return reject(error);
			return resolve(token);
		});
	});
}

exports.decodeToken = async (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (error, decodeToken) => {
			if (error) return reject(error);
			return resolve(decodeToken);
		});
	});
}

exports.hashString = (string) => {
	return bcrypt.hash(string, salt);
}

exports.compareStrings = (string, hashedString) => {
	return bcrypt.compare(string, hashedString);
}

exports.extractPlaceholders = (text, regex = /{{(.*?)}}/g) => {
	return [...text.matchAll(regex)].map(match => match[1]);
}


exports.checkValidVariables = ({variables, validVariables}) => {
	const isObject = (data) => typeof data === 'object'
	if (!isObject(variables)) return false
	for (const variable in variables) {
		if (!validVariables.includes(variable)) return false;
	}
	return true;
}

exports.replacePlaceholders = (text, values, regex = /{{(.*?)}}/g) => {
	return text.replace(regex, (match, placeholder) => values[placeholder] || match);
}
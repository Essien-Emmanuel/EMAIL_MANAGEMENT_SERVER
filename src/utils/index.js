const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const { Readable } = require('stream');
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
	return [...text.matchAll(regex)].map(match => match[1].trim());
}

exports.removeStringDuplicatesFromArr = (arr) => {
	const unique = arr.filter( (value, index) =>  arr.indexOf(value) === index );
	return unique;
}

exports.removeArrDuplicatesFromArr = (arrayOfArrays) => {
	const unique = Array.from(new Set(arrayOfArrays.map(JSON.stringify))).map(JSON.parse)
	return unique;
}

exports.parseVariablePaths = (content) => {
	const variablePaths = this.extractPlaceholders(content) // [ "subscriber.first_name" ]
	const tokens = variablePaths.map(variable => variable.split('.'));
	const uniqueTokens = this.removeArrDuplicatesFromArr(tokens);
	return uniqueTokens;
}

exports.normalizeString = (str) => {
	return str.replace(/\s+/g, ' ').trim();

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

exports.convertExcelFileToJsObject = (xlFileInBuffer) => {
	return new Promise((resolve, reject) => {
		try {
			const workbook = xlsx.read(xlFileInBuffer, { type: 'buffer' });
			const sheetName = workbook.SheetNames[0];
			const workSheet = workbook.Sheets[sheetName];
			const excelToJsonData = xlsx.utils.sheet_to_json(workSheet);
			return resolve(excelToJsonData)
		} catch (error) {
			return reject(error)
		}
	})
}

exports.convertCsvToObject = (fileBuffer) => {
	return new Promise((resolve, reject) => {
		const csvObjectArray = [];
		const stream = Readable.from(fileBuffer.toString());

		stream
		.pipe(csv())
		.on('data', (data) => {
			csvObjectArray.push(data)
		})
		.on('end', () => {
			const response = {
				isConverted: csvObjectArray.length > 0? true : false,
				data: csvObjectArray
			}
			return resolve(response)
		})
		.on('error', (error) => {
			console.error('Error processing the file:', error);
			return reject(error)
		});

	})
}


exports.checkUndoActionTime = ({ selectedTime,  days = 30 }) => {
  const selectedTimePlusUndoDuration = selectedTime + ( days * 24 * 60 * 60 * 1000);
  const timestamp = new Date().getTime();
  if (selectedTimePlusUndoDuration < timestamp) return false;
  return true
}

exports.deleteElementInList = (list, index) => {
	return list.splice(index, 1)
} 

function isObject(data) {
  return  typeof data === 'object'
}

exports.sanitizeData = (data, fieldsToRemove = ['otp', 'password']) => {
  const sanitizedData = {...data };
  
  if (!isObject(sanitizedData)) return sanitizedData;

  for(const field in sanitizedData) {
    if (fieldsToRemove.includes(field)) {
      delete sanitizedData[field]
    }
    
    if (isObject(sanitizedData[field] && !['createdAt', 'updatedAt'].includes(field))) {
      this.sanitizeData(sanitizedData[field], fieldsToRemove);
    } else return sanitizedData
  }

  return sanitizedData;
}

exports.cleanData = (inputObj, modelInterface) => {
	const fields = Object.keys(inputObj);
	const data = {};
	for (const field of fields) {
		const isField = modelInterface.hasOwnProperty(field);
		if (isField) {
      data[field] = inputObj[field]
    }
	}
	return data
}

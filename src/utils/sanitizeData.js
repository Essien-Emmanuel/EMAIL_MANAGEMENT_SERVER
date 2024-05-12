exports.sanitizeData = (data, fieldsToRemove = ['otp', 'password', '__v']) => {
  const sanitizedData = data;
  
  if (typeof sanitizedData !== 'object' || sanitizedData === null) return sanitizedData;

  for(const field in sanitizedData) {
    if (fieldsToRemove.includes(field)) {
      delete sanitizedData[field]
    }
    else {
      sanitizedData[field] = this.sanitizeData(sanitizedData[field], fieldsToRemove);
    }
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

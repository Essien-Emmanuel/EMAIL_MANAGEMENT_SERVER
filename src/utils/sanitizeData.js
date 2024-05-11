exports.sanitizeDataToJson = (data, fieldsToRemove = ['otp', 'password']) => {
  const sanitizedData = data;
  console.log('sa ', sanitizedData)
  
  if (typeof sanitizedData !== 'object' || sanitizedData === null) return sanitizedData;

  for(const field in sanitizedData) {
    if (fieldsToRemove.includes(field)) {
      delete sanitizedData[field]
    }
    else {
      sanitizedData[field] = this.sanitizeDataToJson(sanitizedData[field], fieldsToRemove);
    }
  }

  return sanitizedData;
}

// exports.sanitizeDataToJson = (d, fieldsToRemove) => {
//   const data = {...d}
// 	if (typeof data !== 'object' || data === null) return data;

// 	for (const field in data) {
// 		if (fieldsToRemove.includes(field)) {
// 			delete data[field]
// 		}
// 		else {
// 			data[field] = this.sanitizeDataToJson(data[field], field)
// 		}
// 	}
// 	return data;
// }
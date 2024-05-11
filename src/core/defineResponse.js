const {sanitizeData}  = require('../utils/sanitizeData');

function defineResponse(data) {
  const fieldsToRemove = ['otp', 'password'];
  const sanitizedData = sanitizeData({ ...data.data }, fieldsToRemove);
  return {
    status: 'success',
    messaage: data.message,
    statusCode: data.statusCode || 200,
    data: sanitizedData 
  }
}

module.exports = defineResponse;
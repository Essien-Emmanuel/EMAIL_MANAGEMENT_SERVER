const crypto = require('crypto');

exports.generateToken = () => {
  return new Promise((resolve, reject) => {
    try {
      const generatedToken = crypto.randomBytes(64).toString('hex');
      return resolve(generatedToken)     
    } catch (error) {
      return reject(error)
    }
  })
}
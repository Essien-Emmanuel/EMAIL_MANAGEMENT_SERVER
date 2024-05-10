class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode;
    this.errorType = 'APIError'

    Error.captureStackTrace(this, this.constructor);
  }

  getType() {
    return this.errorType;
  }
}

module.exports = ApiError;
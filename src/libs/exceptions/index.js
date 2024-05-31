const GenericError = require('../../core/AppError');

class ServiceError extends GenericError {
	constructor(message = "Malformed Or Invalid Request Parameters!") {
		super(message, 400);
	}
}

class ResourceConflictError extends GenericError {
	constructor(message = "Already Exist!") {
		super(message, 409);
	}
}

class ValidationError extends GenericError {
	constructor(message = "Invalid Input!", errors = []) {
		message = errors.length > 0 ? `${errors[0].message}` : message;
		super(message, 422);
		this.errors = errors;
	}
}

class AuthenticationError extends GenericError {
	constructor(message = "Authentication Failed!") {
		super(message, 401);
	}
}

class AuthorizationError extends GenericError {
	constructor(message = "you are not authorized to perform this action") {
		super(message, 403);
	}
}

class NotFoundError extends GenericError {
	constructor(message = "Not Found!") {
		super(message, 404);
	}
}

class InternalServerError extends GenericError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
class MongdbError extends GenericError {
	constructor(message = 'mongodb error') {
		super(message, 500)
	}
}

module.exports = {
  NotFoundError,
  AuthenticationError, 
  AuthorizationError,
  ResourceConflictError,
  ServiceError,
  ValidationError,
  InternalServerError,
	MongdbError
}


const Validator = require("fastest-validator");
const { isValidObjectId } = require("mongoose");

//create a custom validation message
new Validator({
	useNewCustomCheckerFunction: true,
	messages: {
		id: "The '{field}' must be '{expected}'",
	},
});

exports.idSchemaValue = {
  type: "custom",
  check(value, errors, _schema) {
    if (!isValidObjectId(value))
      errors.push({ type: "id", expected: "Mongoose ObjectId type", actual: value });
    return value;
  },
};

const joiRegisterValidation = require("./joi/registerValidation");

const validatorOption = "Joi";

const registerUserValidation = (userInput) => {
  if (validatorOption === "Joi") {
    return joiRegisterValidation.validateRegisterSchema(userInput);
  }
  throw new Error("validator undefined");
};

module.exports = {
  registerUserValidation,
};

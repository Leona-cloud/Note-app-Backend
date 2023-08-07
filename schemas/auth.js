const PasswordComplexity = require("joi-password-complexity");
const Joi = require('joi');

const complexityOptions = {
    min: 8,
    max: 25,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };


function validateUser(user){
    const schema = Joi.object({
        userName: Joi.string().required().min(6).max(12),
        email: Joi.string().required().trim().lowercase().email(),
        password: PasswordComplexity(complexityOptions),
        confirmPassword: Joi.ref('password'),
    })
    .with('password', 'confirmPassword')


    const options = {
        abortEarly: false,
        errors: {
          wrap: {
            label: "",
          },
        },
      };

    return schema.validate(user, options)
};



function loginValidation(user){
    const logSchema = Joi.object({
        email: Joi.string().required().trim().lowercase().email(),
        password: Joi.string().required().min(8).max(12),
    });

    const options = {
        abortEarly: false,
        errors: {
          wrap: {
            label: "",
          },
        },
      };

    return logSchema.validate(user, options)
};





module.exports.validate = validateUser;
module.exports.loginValidation = loginValidation;
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const PasswordComplexity = require("joi-password-complexity");
const dotenv = require('dotenv').config();


const userSchema = new mongoose.Schema({
    userName:{
        type : String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 12
    },
    email: {
        type: String,
        required: true,
        lowercase:true
    },
    password: new PasswordComplexity({
        min: 8,
        max: 25,
        lowercase: 1,
        uppercase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4
    }),
    confirmPassword: {
        type: String,
        required: true,
         minlength: 8,
        maxlength: 1024
    },

});
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.notes_jwtPrivateKey);
    return token;
}

const User = mongoose.model('User', userSchema);


function validateUser(user){
    const schema = Joi.object({
        userName: Joi.string().required().min(6).max(12),
        email: Joi.string().required().trim().lowercase().email(),
        password: new PasswordComplexity({
            min: 8,
            max: 25,
            lowercase: 1,
            uppercase: 1,
            numeric:1,
            symbol: 1,
            requirementCount: 4
        }),
        confirmPassword: Joi.ref('password'),
    })
    .with('password', 'confirmPassword')

    return schema.validate(user)
};

function loginValidation(user){
    const logSchema = Joi.object({
        email: Joi.string().required().trim().lowercase().email(),
        password: Joi.string().required().min(8).max(12),
    })
    return logSchema.validate(user)
}


module.exports.User = User;
module.exports.validate = validateUser;
module.exports.loginValidation = loginValidation;

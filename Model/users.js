const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const PasswordComplexity = require("joi-password-complexity");



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
    password:  PasswordComplexity({
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
    isAuthor: {
        type: Boolean,
        default: false
    }

});
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.notes_jwtPrivateKey);
    return token;
}

const User = mongoose.model('User', userSchema);






module.exports.User = User;


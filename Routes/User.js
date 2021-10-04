const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const{User, validate} = require('../Model/users')


router.post('/register', async (req, res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['userName', 'email', 'password', 'confirmPassword']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        return res.send("Passwords do not match");
    };

    try {
        const result = await user.save();
        console.log(result);
        const token = user.generateAuthToken();
       res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userName', 'email']));
    } catch (ex) {
        console.log(ex.message);
    }

})

module.exports = router;
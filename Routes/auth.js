const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const{User} = require('../Model/users')
const {validate, loginValidation} = require('../schemas/auth')


router.post('/login', async (req,res)=>{
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
        success: false,
        message: "Invalid email or password"
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or  password');

    const token = user.generateAuthToken();
    res.status(200).json({
        success: true,
        message: 'user logged in successfully',
        token
    });

});

router.post('/register', async (req, res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email : req.body.email});
    if (user) return res.status(400).json({
        success: false,
        message: "User already registered"
    })

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

});

module.exports = router;
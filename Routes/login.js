const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');
const{User, loginValidation} = require('../Model/users');

router.post('/', async (req,res)=>{
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('User not registered please sign up');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or  password');

    const token = user.generateAuthToken();
    res.send(token);

});


module.exports = router;
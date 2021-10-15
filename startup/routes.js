const express = require('express');
const notes = require('../Routes/note');
const user = require('../Routes/User');
const login = require('../Routes/login');
const error = require('../middleware/error');


module.exports = function (app){
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/notes', notes);
app.use('/api/auth', login);
app.use('/api/auth', user);
app.use(error);
}
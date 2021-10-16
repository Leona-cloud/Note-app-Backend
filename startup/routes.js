const express = require('express');
const notes = require('../Routes/note');
const auth= require('../Routes/auth');
const error = require('../middleware/error');


module.exports = function (app){
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/notes', notes);
app.use('/api/auth', auth);
app.use(error);
}

const winston = require('winston');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();



module.exports = function(){
    const db = process.env.DB_CONNECT
mongoose.connect(db, 
    {useNewUrlParser: true, 
        useUnifiedTopology: true})
        .then(()=> console.log(`connected to ${db}`));
  
}

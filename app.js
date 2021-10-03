const express = require('express');
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const config = require('config');
const notes = require('./Routes/note')

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use('/api/notes', notes);

//dotenv.config();
const db = config.get('db')
mongoose.connect(db, 
    {useNewUrlParser: true, 
        useUnifiedTopology: true})
        .then(()=> console.log(`connected to ${db}`))
        .catch(err => console.error("unable to connect", err));
    
    
    
    
    
    const port = process.env.PORT || 3000
    const server = app.listen(port, ()=>{
        console.log(`server is running on port ${port}.....`);
    });

module.exports = server;    

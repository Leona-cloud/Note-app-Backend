const winston = require('winston');
const express = require('express');
const cors = require("cors");



const app = express();

app.use(cors({
    origin: '*'
  }));




require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);


    const port = process.env.PORT || 3000;
    const server = app.listen(port, ()=>{
        winston.info( `server is running on port ${port}.....`);
        console.log( `server is running on port ${port}.....`);
    });

module.exports = server;    

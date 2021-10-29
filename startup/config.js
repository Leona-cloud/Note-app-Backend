const dotenv = require('dotenv').config();

module.exports = function(){
    if(!process.env.notes_jwtPrivateKey){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
}

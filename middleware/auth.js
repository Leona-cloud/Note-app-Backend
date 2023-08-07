const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../Model/users');

async function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied');

        try {
            const decoded = jwt.verify(token, process.env.notes_jwtPrivateKey)
            const user = await User.findOne({_id: decoded._id});
            if(user){
                req.user = user;
                next();
            }else{
                return res.status(401).json({
                  success: false,
                  message: 'User access forbidden'
                })
              }
            
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token or Token expired'
              })
        };
           
    
};

module.exports = auth;
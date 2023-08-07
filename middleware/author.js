function author(req, res, next){
    console.log(req.user.isAuthor)
    if(req.user.isAuthor !== true) return res.status(403).json({success: false, message: 'Unauthorized user'})

    next();
}

module.exports = author;
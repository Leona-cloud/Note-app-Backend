function author(req, res, next){
    if(!req.user.isAuthor) return res.status(403).json({success: false, message: 'Unauthorized user'})

    next();
}

module.exports = author;
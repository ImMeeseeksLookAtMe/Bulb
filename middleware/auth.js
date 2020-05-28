const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const db = require("../models");

// Protect routes 

exports.protect = asyncHandler(async (req, res, next) =>{
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1]
    }
    console.log(token)
 /*    else if(req.cookies.token) {
        token = req.cookies.token
    } */

    //make sure token exists
    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route.", 401))
    }

    try {
        //Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await db.User.findById(decoded.id)
        
        next();
    } catch(err) {
        return next(new ErrorResponse("Not authorized to access this route.", 401))
    }
})


// Grant access to specific routes


exports.authorize = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
           return next(
            new ErrorResponse(`User role ${req.user.role}. Not authorized to access this route.`, 403)  
           ) 
        }
        next()
    }
}


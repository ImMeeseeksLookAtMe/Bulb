const crypto = require('crypto')
const db = require("../models");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require ('express-validator')

//@desc  Register user
//@route POST /api/v1/auth/register
//@acess PUBLIC

exports.register = asyncHandler(async(req, res, next) => {
    //validation-express
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    //from body we need ...
    const { email, password, role, name, surname} = req.body

    //create user in DB
    let user = await db.User.create({ 
        email,
        password, 
        role,
        name,
        surname
    }); 

    sendTokenResponse(user, 200, res)
})

//@desc  Signin user
//@route POST /api/v1/auth/login
//@acess PUBLIC

exports.login = asyncHandler(async(req, res, next) => {
    //from body we need ...
    const { email, password } = req.body
    
    //check if anything is written in body
    if(!email || !password) {
        return(next(new ErrorResponse("Please provide email and password", 400)))
    }
    
    // check user 
    const user = await db.User.findOne({ email }).select("+password")
    
    if(!user){
        return next(new ErrorResponse("Invalid password or email.", 401))
    }

    //check if password is matches
    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        return next(new ErrorResponse("Invalid password or email.", 401))
    }
    
    sendTokenResponse(user, 200, res)
})



//@desc  Get current user info
//@route GET /api/v1/auth/me
//@acess Private

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await db.User.findById(req.user._id).select('-password')

    res.status(200).json({
        sucess: true, 
        data: user
    })
})

//@desc  Get current user data
//@route GET /api/v1/auth
//@acess Private
exports.getUserData = asyncHandler(async (req, res, next) => {
    const user = await db.User.findById(req.user._id).select('-password')

    res.status(200).json({
        sucess: true, 
        data: user
    })
})

//@desc  Update password
//@route PUT /api/v1/auth/updatepassword
//@acess Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await db.User.findById(req.user.id).select('+password');

    //check current password 
    if(!(await user.comparePassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
})

//@desc  Forgot password
//@route POST /api/v1/auth/forgotpassword
//@acess Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await db.User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorResponse('There is no user with that email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    
    const message = `You are reciving this email because you (or someone else) has requested the reset of the password. 
    Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
           email: user.email,
           subject: 'Password reset token',
           message
        });

        res.status(200).json({
            success: true,
            data: 'Email sent', 
            user
        })

    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
})

//@desc  Reset Password
//@route PUT /api/v1/auth/resetpassword/:resettoken
//@acess Public

exports.resetPassword= asyncHandler(async (req, res, next) => {
    //Get hashed token
    const resetPasswordToken = crypto
     .createHash('sha256')
     .update(req.params.resettoken)
     .digest('hex');

    const user = await db.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorResponse('Invalid token', 400));
    }

    //Set the New PASSWORD
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res)
})

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token 
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    
    if(process.env.NODE_ENV === "production") {
        options.secure = true;
    };

    res
     .status(statusCode)
     .cookie("token", token, options)
     .json({
         sucess: true,
         token
     })   
}

//@desc  Update user details
//@route PUT /api/v1/auth/updatedetails
//@acess Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await db.User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        sucess: true, 
        data: user
    })
})
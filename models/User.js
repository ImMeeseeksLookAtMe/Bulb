const crypto = require('crypto');
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["publisher", "user" ],
        default: "publisher"    
    },
    name: {
        type:String
    },
    surname: {
        type: String
    },
    avatar:{
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

 

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    //Set the expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
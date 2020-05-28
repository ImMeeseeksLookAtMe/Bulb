const express = require("express");
const router = express.Router();
const  { check } = require ('express-validator');
const { 
    register, 
    login, 
    getMe,  
    forgotPassword, 
    resetPassword, 
    updateDetails,
    updatePassword,
    getUserData
} = require("../controller/auth")

const { protect, authorize } = require("../middleware/auth")

router
 .post("/register", [
    check('name', 'Name is required').not().isEmpty(),
    check('surname', 'Last name is required').not().isEmpty(),
    check('email', 'Please add a valid email').isEmail(),
    check('password', 'Please enter a wasord with 6 or more charaters')
    .isLength({min: 6})
 ], register)

router
 .post("/login",login);

router
 .get("/me", protect, getMe);

router
 .put("/updatedetails", protect, updateDetails);

router
 .put("/updatepassword",protect, updatePassword);

router
 .post("/forgotpassword", forgotPassword);

router
 .put("/resetpassword/:resettoken", resetPassword);

router.get("/", getUserData)

module.exports = router;

const db = require("../models");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");


//@desc  Get single User
//@route GET /api/v1/auth/users/:id
//@acess Private/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await db.User.findById(req.params.id)

    res.status(200).json({
        sucess: true, 
        data: user
    })
});


//@desc  Create User
//@route POST /api/v1/auth/users
//@acess Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await db.User.create(req.body)

    res.status(201).json({
        sucess: true, 
        data: user
    });
});

//@desc  Update User
//@route PUT /api/v1/auth/users/:id
//@acess Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await db.User.findByIdAndUpdate(req.parmas.id, req.body, {
        runValidators: true,
        new: true
    });

    res.status(201).json({
        sucess: true, 
        data: user
    });
});

//@desc  Delete User
//@route Delete /api/v1/auth/users/:id
//@acess Private/Admin

exports.removeUser = asyncHandler(async (req, res, next) => {
   await db.User.findByIdAndDelete(req.params.id);

    res.status(201).json({
        sucess: true, 
        data: {}
    });
});

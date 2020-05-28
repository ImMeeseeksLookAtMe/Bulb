const express = require("express");
const { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    removeUser,
} = require("../controller/users");

const User = require('../models/User')

const router = express.Router({mergeParams: true})

//middleware
const { protect, authorize } = require("../middleware/auth");
//manjkajo advanceResults

//anything below is going to be 
router.use(protect);
router.use(authorize("admin"));

router
 .route('/')
 .get(getUsers)
 .post(createUser);

router
 .route('/:id')
 .get(getUser)
 .put(updateUser)
 .delete(removeUser);

module.exports = router;
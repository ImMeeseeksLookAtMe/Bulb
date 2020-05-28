const express = require("express");
const router = express.Router({ mergeParams: true });
const { 
    createService,
    getServices,
    getTourServices,
    updateService,
    deleteService
} = require("../controller/service");
const { protect, authorize } = require("../middleware/auth");

router
 .route('/')
 .post(createService)
 .get(getServices)
 .get(getTourServices)

router
 .route('/:id')
 .put(updateService)
 .delete(deleteService)

module.exports = router;
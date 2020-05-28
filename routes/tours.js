const express = require("express");
const router = express.Router({ mergeParams: true });
const { 
    getTours,
    getTour,
    createTour,
    deleteTour,
    updateTour
} = require("../controller/tour.js");
const { protect, authorize } = require("../middleware/auth");

router
 .route('/')
 .get(protect, getTours)
 .post(createTour)

router
 .route('/:id')
 .get(getTour)
 .delete(deleteTour)
 .put(updateTour)

module.exports = router;
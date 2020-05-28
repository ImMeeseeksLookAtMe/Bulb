const db = require("../models")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

//@desc Get all TOURS for specific Workspace
//@route GET /api/v1/workspace/:workspaceId/tours
//@acess Private
exports.getTours = asyncHandler(async(req, res, next)=>{    
    const tours = await db.Tour
    .find({ workspace: req.params.workspaceId })
    .populate({
        path:'workspace',
        select:'user name createdAt'
    })
     
    res.status(200).json({
        success: true,
        count: tours.length,
        data: tours
    })
});

//@desc Get single TOUR
//@route GET /api/v1/tours/:id
//@acess Private
exports.getTour = asyncHandler(async(req, res, next)=>{    
    const tour = await db.Tour
    .findById(req.params.id)
    .populate({
        path:'service'
    });

    if(!tour){
        return next(new ErrorResponse(
            `There is no tour with id of ${req.params.id}.`, 
            404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: tour
    });
});


//@desc Create TOUR
//@route POST /api/v1/workspace/:workspaceId/tours
//@acess Private

exports.createTour = asyncHandler(async(req, res, next)=> {
    //body gets params ID
    req.body.workspace = req.params.workspaceId;
    
    // find workspace
    const workspace = await db.Workspace.findById(req.params.workspaceId).populate('service');

    
    if(!workspace) {
        return next(
            new ErrorResponse(`No workspace with the id of ${req.params.workspaceId}`, 
            404
            )
        );
    }

    const tour = await db.Tour.create(req.body)

    res.status(200).json({
        sucess: true,
        data: tour
    })
    
});

//@desc Update TOUR
//@route PUT /api/v1/tour/:id
//@acess Private

exports.updateTour = asyncHandler(async(req, res, next)=> {
    let tour = await db.Tour.findById(req.params.id);

    if(!tour) {
        return next(
            new ErrorResponse(`No tour with the id of ${req.params.id}`, 
            404
            )
        );
    }

    tour = await db.Tour.findOneAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        sucess: true,
        data: tour
    })

});

//@desc Delete TOUR
//@route DELETE /api/v1/tour/:id
//@acess Private

exports.deleteTour = asyncHandler(async(req, res, next)=> {
    let tour = await db.Tour.findById(req.params.id);

    if(!tour) {
        return next(
            new ErrorResponse(`No tour with the id of ${req.params.id}`, 
            404
            )
        );
    }

    await tour.remove()

    res.status(200).json({
        sucess: true,
        data: {}
    })

});
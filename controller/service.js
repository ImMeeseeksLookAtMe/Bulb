const db = require("../models")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

//@desc Get all SERVICES in WORKSPACE
//@route GET /api/v1/workspace/:workspaceId/service
//@acess Private

exports.getServices = asyncHandler(async(req, res, next)=>{    
    const services = await db.Service
    .find({ workspace: req.params.workspaceId})
    .populate({
        path:'workspace',
        select:'user name createdAt'
     })
    
    res.status(200).json({
        success: true,
        count: services.length,
        data: services
    })
});


//@desc Get all SERVICES with specific TOUR
//@route GET /api/v1/tour/:tourId/service
//@acess Private

exports.getTourServices = asyncHandler(async(req, res, next)=>{    
    const service = await db.Service
    .find({ tour: req.params.tourId})
    .populate({
        path:'tour',
        select: 'tourCode'
    })

    //here you can check if tour is in this workspace
    

    res.status(200).json({
        success: true,
        count: services.length,
        data: service
    })
});

//@desc Create Service
//@route POST /api/v1/workspace/:workspaceId/service
//@acess Private

exports.createService = asyncHandler(async(req, res, next)=> {
    //body dobi params ID
    req.body.workspace = req.params.workspaceId;
    // find workspace
    const workspace = await db.Workspace.findById(req.params.workspaceId);

    if(!workspace) {
        return next(
            new ErrorResponse(`No workspace with the id of ${req.params.workspaceId}`, 
            404
            )
        );
    }

    const service = await db.Service.create(req.body)

    res.status(200).json({
        sucess: true,
        data: service
    })

});

//@desc Update Service
//@route PUT /api/v1/service/:id
//@acess Private

exports.updateService = asyncHandler(async(req, res, next)=> {
    let service = await db.Service.findById(req.params.id);

    if(!service) {
        return next(
            new ErrorResponse(`No service with the id of ${req.params.id}`, 
            404
            )
        );
    }

    service = await db.Service.findOneAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        sucess: true,
        data: service
    })

});

//@desc Delete SERVICE
//@route DELETE /api/v1/service/:id
//@acess Private

exports.deleteService = asyncHandler(async(req, res, next)=> {
    let service = await db.Service.findById(req.params.id);

    if(!service) {
        return next(
            new ErrorResponse(`No service with the id of ${req.params.id}`, 
            404
            )
        );
    }

    await service.remove()

    res.status(200).json({
        sucess: true,
        data: {}
    })

});
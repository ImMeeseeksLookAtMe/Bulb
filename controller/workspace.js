//IMPORT 
const db = require("../models")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
//@desc Get all Workspaces
//@route GET /api/v1/user/:id/workspace KASNEJE
//@route GET /api/v1/workspace ZDAJ
//@acess only logged in user

// VERJETNO NE BO POTREBE TO TEJ POTI

exports.getAllWorkspaces = asyncHandler(async(req, res, next) => {
    let workspaces = await db.Workspace.find();

    res.status(200).json({ 
        sucess: true, 
        count: workspaces.length,
        data: workspaces
    });
});

//@desc Get 1 Workspaces
//@route GET /api/v1/user/:id/workspace/:workspace_id KASNEJE
//@route GET /api/v1/workspace/:workspaceId ZDAJ
//@acess only logged in user

exports.getWorkspace = asyncHandler(async(req, res, next) => {
    //check for published workspace
    let workspace = await db.Workspace.findById(req.params.id);

    if(!workspace) {
        return next(
            new ErrorResponse(`Workspace not found. Id ${req.params}`, 404)
        )
    }

    if(workspace.user.toString() !== req.user.id && req.user.role !== "admin"){
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorized to update this workspace`, 401)
        )
    }


    res.status(200).json({ 
        sucess: true, 
        data: workspace 
    });
});

//@desc Create 1 Workspaces
//@route POST /api/v1/user/:id/workspace KASNEJE
//@route POST /api/v1/workspace/ ZDAJ
//@acess only logged in user

exports.createWorkspace = asyncHandler(async(req, res, next) => {
    //add user to req.body
    req.body.user = req.user.id;

    // check for published workspace
    const publishedWorkspace = await db.Workspace.findOne({user: req.user.id})
    
    //If the user is not admin, they van only add 1 workspace
    if(publishedWorkspace && req.user.role !== "admin"){
        return next(new ErrorResponse(`User with ID ${req.user.id} is not authorized to create more than 1 Workspace.`, 
        400)
        )
    }

    let workspace = await db.Workspace.create(req.body);

    
    res.status(201).json({
        sucess: true,
        data: workspace
    });
});

//@desc Update 1 Workspaces
//@route PUT /api/v1/user/:id/workspace KASNEJE
//@route PUT /api/v1/workspace/:id ZDAJ
//@acess Private

exports.updateWorkspace = asyncHandler(async (req, res, next) => {
    let workspace = await db.Workspace.findById(req.params.id)

    //check if workspace exists
    if(!workspace) {
        return next(new ErrorResponse("The workspace you are trying to find does not exists.", 404))
    }

    //make sure User is owner of the workspace
    if(workspace.user.toString() !== req.user.id && req.user.role !== "admin"){
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorized to update this workspace`, 401)
        )
    }

    workspace = await db.Workspace.findOneAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    }) 

    res.status(200).json({
        sucess: true,
        data: workspace
    })
})

//@desc remove 1 Workspace
//@route DELETE /api/v1/user/:id/workspace KASNEJE
//@route DELETE /api/v1/workspace/:id ZDAJ
//@acess Private

exports.deleteWorkspace = asyncHandler(async (req, res, next) => {
    const workspace = await db.Workspace.findById(req.params.id)

     //check if workspace exists
     if(!workspace) {
        return next(new ErrorResponse("The workspace you are trying to find does not exists.", 400))
    }

    if(workspace.user.toString() !== req.user.id && req.user.role !== "admin"){
        return next(
            new ErrorResponse(`User ${req.params.id} is not valid to update this workspace`, 401)
        )
    }

    workspace.remove();

    res.status(200).json({
        sucess: true,
        data: {}
    })
})

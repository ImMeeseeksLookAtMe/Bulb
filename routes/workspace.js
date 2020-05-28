const express = require("express");
const router = express.Router({mergeParams: true});
const { 
    getAllWorkspaces, 
    createWorkspace, 
    getWorkspace, 
    deleteWorkspace, 
    updateWorkspace 
} = require("../controller/workspace.js");
const { protect, authorize } = require("../middleware/auth");

//include other resource routers
const toursRouter = require('./tours')
const servicesRouter = require('./service')

//Re-route into other resource routers
router.use('/:tourId/tour', toursRouter);
router.use('/:workspaceId/service', servicesRouter);

router 
 .route("/")
 .get(getAllWorkspaces)
 .post(protect, createWorkspace)

router
 .route("/:id")
 .get(protect, getWorkspace)
 .put(protect, updateWorkspace)
 .delete(protect, deleteWorkspace)


module.exports = router;
const mongoose = require("mongoose"); 

const WorkspaceSchema = new mongoose.Schema ({
    name: {
        type: String,
        maxLength: 50,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    invitedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    logoName: {
        type: String,
        default: "no_logo.png"
    },
    logoPath: {
        type: String
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
} 
)

// Cascade delete TOUR when a workspace is deleted
WorkspaceSchema.pre('remove', async function (next) {
    await this.model('Tour').deleteMany({ workspace: this._id })
    next();
});

//Cascade delete SERVICE when a workspace is deleted
WorkspaceSchema.pre('remove', async function (next) {
    await this.model('Service').deleteMany({ workspace: this._id })
    next();
});

//Reverse populate Tour-s
WorkspaceSchema.virtual('tourIds', {
    ref: 'Tour',
    localField: '_id',
    foreignField: 'workspace',
    justOne: false
})

//Reverse populate Service-s
WorkspaceSchema.virtual('serviceIds', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'workspace',
    justOne: false
})


const Workspace = mongoose.model("Workspace", WorkspaceSchema);

module.exports = Workspace;
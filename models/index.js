const mongoose = require("mongoose");
mongoose.set("debug", true)
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost:27017/progress-new",{
    useCreateIndex: true,
    useNewUrlParser: true,
    keepAlive: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

module.exports.Workspace = require("./Workspace");
module.exports.User = require("./User");
module.exports.Service = require("./Service");
module.exports.Tour = require("./Tour");
module.exports.Profile = require('./Profile');
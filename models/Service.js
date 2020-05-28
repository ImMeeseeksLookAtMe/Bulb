const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
        providerName: {
            type: String,
            maxlength: 40
        },
        companyName:{
            type: String,
            maxlength: 40
        },
        companyAddress:{
            type: String,
            maxlength: 40
        },
        country:{
            type: String,
            maxlength: 40
        },
        city:{
            type: String,
            maxlength: 40
        },
        address: {
            type: String,
            maxlength: 50
        },
        email:{
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        phone:{
            type: String
        },
        price:{
            type: Number
        },
        typeOfPayment:{
            type: String,
            enum:["INVOICE", "NO INVOICE", "PROFORMA", "CASH"],
            default: "INVOICE"
        },
        typeOfService: {
            type: String,
            enum:["MEAL", "ACCOMODATION", "GUIDE", "OTHER", "TRANSFER", "COMMENT"],
            default: "ACCOMODATION"
        },
        pax: {
            type: Number,
        }, 
        driver: {
            type: Number,
        },
        guides: {
            type: Number,
        },
        date: {
            type:Number,
        }, 
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Workspace'
        },
        isService: {
            type: Boolean,
            default: true
        },
        comment: {
            type: String,
            maxlength: 500
        },
        tours:  [
            {
            tourId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Tour'
            }, 
            dateStart: {
                type: Date
            },
            dateEnd: {
                type:Date
            },
            price: {
                type: Number
            }, 
            coutry: {
                type: String
            },
            city: {
                type: String
            }, 
            providerName: {
               type: String 
            },
            typeOfPayment: {
                type: String
            },
            tourCode: {
                type: String
            },
            itineraryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tour'
            },
            pax: {
                type: Number
            },
            drivers: {
                type: Number
            },
            guides: {
                type: Number
            },
            created: {
                type: Date,
                default: Date.now
            }
            }
        ]
    }
);


const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema({
        tourCode: {
            type:String,
            unique: true,
            required: true,
        },
        outInvoice: {
            type: Number
        },
        created: {
            type: Date,
            default: Date.now
        },
        providerName:{
            type: String
        },
        startDate:{
            type: Date,
            required: true
        },
        endDate:{
            type: Date,
            required: true
        },
        startCity:{
            type: String
        },
        endCity:{
            type: String
        },
        groupPax:{
            type: Number
        },
        tourPax:{
            type: Number
        },
        driverPax:{
            type: Number
        },
        tourDates: [
            {
                dateStart: {
                    type: Date
                },
                dateEnd: {
                    type: Date
                },
                serviceId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Service"
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
                typeOfPayment:{
                    type: String,
                    enum:["INVOICE", "NO INVOICE", "PROFORMA", "CASH"],
                    default: "INVOICE"
                },
                created: {
                    type: Date,
                    default: Date.now
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
                isService: {
                    type: Boolean,
                }, 
                day: {
                    type:Number
                },
                remark: {
                    type: String,
                    maxlength: 400
                },
                mealRemark: {
                    type: String,
                    maxlength: 400
                }  
            }
        ],
        range: [
                {
                dateStart:{
                    type:Date
                },
                day: {
                    type:Number
                },
                isService: {
                    type:Boolean,
                }
            }
        ],
        tourDays: {
            type: Number
        },
        tourNights:{
            type: Number
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
        }
    }
);

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
const mongoose = require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId

const timeSlotSchema = new mongoose.Schema({

    userId:{type:ObjectId,ref:"User",required:true},
    firstDose:{type:Boolean,default:false},
    secondDose:{type:Boolean,default:false},
    timeSlot:{type:String},   //"10:00"
    dateSlot:{type:String},   //"1 June 2021"

},{timestamps:true})

module.exports= mongoose.model("TimeSlot",timeSlotSchema)
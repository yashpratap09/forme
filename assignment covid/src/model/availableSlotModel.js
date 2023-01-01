const mongoose = require('mongoose')
const ObjectId=mongoose.Schema.Types.ObjectId

const availableSlotSchema = new mongoose.Schema({

    allTimes :  [String] ,
    availDose:  [Number] ,
    dateArr  :  [String] ,   
    availDate:  [Number] 

},{timestamps:true})

module.exports= mongoose.model("AvailableSlot",availableSlotSchema)
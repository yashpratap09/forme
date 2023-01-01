const moment=require('moment')
const userModel=require('../model/userModel')
const availSlotModel= require('../model/availableSlotModel')
const timeSlotModel =require('../model/timeSlotModel')

//  For Time 
 let x = {
  slotInterval: 30,
  openTime: '10:00',
  closeTime: '17:00'
};

let startTime = moment(x.openTime, "HH:mm");
let endTime = moment(x.closeTime, "HH:mm")

let allTimes = [];

while ( endTime > startTime ) {
  allTimes.push(startTime.format("HH:mm")); 
  startTime.add(x.slotInterval, 'minutes');
}
 console.log(allTimes);

// For Date
let dateArr=[]
for(let i=1;i<=30;i++){
  dateArr.push(i+" June 2021")
}
// console.log(dateArr)

let availDose=[]
for(let j=0;j<14;j++){
  availDose.push(10)
}
// console.log(availDose)

let availDate=[]
for(let j=0;j<30;j++){
  availDate.push(140)
}
// console.log(availDate)


const slotAvailable =async function (req,res){
    try{
         
          let userid=req.params.userId
          let data=req.body
          if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Request body doesn't be empty"})
          let {firstDose,secondDose,timeSlot,dateSlot}=data

          if(!firstDose && !secondDose) return res.status(400).send({status:false,message:"Please provide one filed firstDose or secondDose its mandatory"})
          if(!timeSlot) return res.status(400).send({status:false,message:"timeSlot is mandatory"})
          if(!dateSlot) return res.status(400).send({status:false,message:"dateSlot is mandatory"})
          if(firstDose==false && secondDose==true)  return res.status(400).send({status:false,message:"Please book your firstDose before secondDose"})

          let checkUserDose = await timeSlotModel.findOne({userId:userid})
          if(checkUserDose){
            if(checkUserDose.firstDose==true && firstDose==true && secondDose==false) return res.status(400).send({status:false,message:"Please book your secondDose"})
            if(checkUserDose.secondDose==true && secondDose==true) return res.status(400).send({status:false,message:"You are already fully vaccinated"})
            if(checkUserDose.firstDose==false && secondDose==true) return res.status(400).send({status:false,message:"Please book your firstDose"})
          }
          if((checkUserDose==null) && secondDose==true) return res.status(400).send({status:false,message:"Please book your firstDose"})
         
          data.userId=userid

          let availData= await availSlotModel.find()
          if(availData.length>0)
          {
            allTimes=availData[0].allTimes
          availDose=availData[0].availDose
          dateArr=availData[0].dateArr
          availDate=availData[0].availDate
          }
          let userData= await userModel.findById(userid)
          
          if(userData.admin==false){
            let count=0
            let count1=0
              for(let a=0;a<allTimes.length;a++){
                             
                  if(timeSlot==allTimes[a]){
                     count++;
                     let b=availDose[a]-1
                     if(b==0){
                      availDose.splice(a,1)
                      allTimes.splice(a,1)
                     }else{
                      availDose.splice(a,1,b)
                     }      
                  }  
              }

              for(let c=0;c<dateArr.length;c++){

                if(dateSlot==dateArr[c]){
                  count1++;
                  let b=availDate[c]-1
                  if(b==0){
                    availDate.splice(c,1)
                   dateArr.splice(c,1)
                  }else{
                    availDate.splice(c,1,b)
                  }      
               } 
              }

              if(count==0)  return res.status(400).send({status:false,message:`this ${timeSlot} is not available`})
              if(count1==0)  return res.status(400).send({status:false,message:`this ${dateSlot} is not available`})
              let obj={allTimes:allTimes,availDose:availDose,dateArr:dateArr,availDate:availDate} 

              await availSlotModel.deleteMany()
              await  availSlotModel.create(obj)
              if(checkUserDose){
                let userSlotData = await timeSlotModel.findOneAndUpdate({userId:userid},data)
              }else{
                let userSlotData = await timeSlotModel.create(data)
              }
              res.status(200).send({status:true,message:`Your vaccination is scheduled ${timeSlot} on ${dateSlot} successfully`})
          }
       
    }catch(err){
        return res.status(500).send({status:true,message:err.message})
    }
}

const userSeeTimeSlots =async function (req,res){
  try{

    if(Object.keys(req.query).length==0 ) return res.status(400).send({status:false,message:"Please provide Date in query params"})
    let data= req.query.Date

    let availTime= await availSlotModel.find()
  
    let availTimeSlot= availTime[0].allTimes
    if(availTimeSlot.length==0)  return res.status(400).send({status:false,message:`No Dose available for this ${data}`})
    let availDoses= availTime[0].availDose
    let arr=[]
    for(let a=0;a<availTimeSlot.length;a++){
      arr.push(availTimeSlot[a]+" - slotsAvailable:"+availDoses[a])
    }

   return res.status(200).send({status:true,message:"Success",data:arr})
  }catch(err){
        return res.status(500).send({status:true,message:err.message})
    }
}

const givenDayAdmin =async function (req,res){
  try{

    if(Object.keys(req.query).length==0 ) return res.status(400).send({status:false,message:"Please provide Date in query params"})
    let data= req.query.Date

    let givenSlot = await timeSlotModel.find({dateSlot:data})
    if(givenSlot.length==0)  return res.status(400).send({status:false,message:"Please provide valid as 1 June 2021"})

    let firstDose =0
    let secondDose =0
    
    for(let a=0;a<givenSlot.length;a++){
       if(givenSlot[a].firstDose==true)  firstDose++
       if(givenSlot[a].secondDose==true)  secondDose++
    }

    let totalDoses=firstDose + secondDose
    let obj={}
    obj.firstDose=firstDose
    obj.secondDose=secondDose
    obj.totalDoses=totalDoses

    return res.status(200).send({status:true,message:"Success",data:obj})

  }catch(err){
        return res.status(500).send({status:true,message:err.message})
    }
}

module.exports={slotAvailable,userSeeTimeSlots,givenDayAdmin}
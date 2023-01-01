const userModel= require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const createUser =async function (req,res){
    try{
        let data= req.body
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Request body doesn't be empty"})
 
        let { Name,PhoneNumber,Age,Pincode,AadharNo,Password }=data
        if(!Name) return res.status(400).send({status:false,message:"Name is required"})
        if(!PhoneNumber) return res.status(400).send({status:false,message:"PhoneNumber is required"})
        if(!Age) return res.status(400).send({status:false,message:"Age is required"})
        if(!Pincode) return res.status(400).send({status:false,message:"Pincode is required"})
        if(!AadharNo) return res.status(400).send({status:false,message:"AadharNo is required"})
        if(!Password) return res.status(400).send({status:false,message:"Password is required"})

        let userData =await userModel.findOne({PhoneNumber})
        if(userData) return res.status(400).send({status:false,message:"PhoneNumber will be unique"})
        
        if(Password){
           data.Password= bcrypt.hashSync(Password,10)
        }

        let createUser = await userModel.create(data)
        return res.status(201).send({status:true,message:"Success",data:createUser})

    }catch(err){
        return res.status(500).send({status:true,message:err.message})
    }
}

const loginUser = async function (req,res){
    try{

        let data=req.body
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Request body doesn't be empty"})
 
        let {Password,PhoneNumber}=data

        if(!PhoneNumber) return res.status(400).send({status:false,message:"PhoneNumber is required"})
        if(!Password) return res.status(400).send({status:false,message:"Password is required"})

        let getUserData= await userModel.findOne({PhoneNumber})
        if(!getUserData) return res.status(400).send({status:false,message:"Invalid PhoneNumber"})

        Password= await bcrypt.compare(Password,getUserData.Password)
        if(!Password) return res.status(400).send({status:false,message:"Invalid Password"})

        let token= jwt.sign({id:getUserData._id},"Secret_Key",{ expiresIn:"1h" })  
        res.status(200).send({status:true,message:"Token",token:token})

    }catch(err){
        return res.status(500).send({status:true,message:err.message})
    }
}


module.exports={createUser,loginUser}
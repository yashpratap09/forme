const express= require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const route=require('./route/route')

app.use(express.json())
mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://palsubodh:Palsubodh@cluster0.mhegah9.mongodb.net/covidCompany")
.then(()=>console.log("mongodb is connected"))
.catch(err=>console.log(err))
app.use("/",route)
app.listen(3000,function(){
    console.log("Happy new year")
})
const router=require('express').Router()
const {createUser, loginUser } = require('../controller/userController')
const {slotAvailable,givenDayAdmin,userSeeTimeSlots}=require('../controller/slotBooking')

router.post('/createUser',createUser)
router.post('/login',loginUser)
router.post('/timeSlot/:userId',slotAvailable)
router.get('/adminDate',givenDayAdmin)
router.get('/userDate',userSeeTimeSlots)

module.exports=router
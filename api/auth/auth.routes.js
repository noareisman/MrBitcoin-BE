const express=require('express')
const router=express.Router()

const {login,signup,logout} = require('./auth.controller')

router.post('/login',login)
router.post('/logout',logout)
router.post('/signup',signup)

module.exports=router
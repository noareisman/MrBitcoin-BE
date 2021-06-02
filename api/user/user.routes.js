const express=require('express')
const router=express.Router()

const {requireAuth}=require('../../middlewares/requireAuth.middleware')
const {getUser,getUsers,deleteUser, updateUser, addUser} = require('./user.controller')

router.get('/',getUsers)
router.post('/',addUser)
router.get('/:id',getUser)
// router.put('/:id',requireAuth,updateUser)
router.put('/:id',updateUser)
// router.delete('/:id',requireAuth,deleteUser)
router.delete('/:id',deleteUser)

module.exports=router
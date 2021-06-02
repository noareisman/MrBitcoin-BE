const express=require('express')
const router=express.Router()

const {requireAuth}=require('../../middlewares/requireAuth.middleware')
const {log}=require('../../middlewares/logger.middleware')
const {getContact,getContacts,deleteContact, updateContact, addContact} = require('./contact.controller')

router.get('/:id',getContact)
router.get('/',getContacts)
// router.post('/',log, requireAuth, addContact)
router.post('/', addContact)
// router.put('/:id',log, requireAuth,updateContact)
router.put('/:id',updateContact)
// router.delete('/:id',log, requireAuth,deleteContact)
router.delete('/:id',deleteContact)

module.exports=router
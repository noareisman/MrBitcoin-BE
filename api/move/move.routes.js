const express=require('express')
const router=express.Router()

const {requireAuth}=require('../../middlewares/requireAuth.middleware')
const {log}=require('../../middlewares/logger.middleware')
const {getMove,getMoves,deleteMove, updateMove, addMove} = require('./move.controller')

router.get('/:id',getMove)
router.get('/',getMoves)
// router.post('/',log, requireAuth, addMove)
router.post('/', addMove)
// router.put('/:id',log, requireAuth,updateMove)
router.put('/:id',updateMove)
// router.delete('/:id',log, requireAuth,deleteMove)
router.delete('/:id',deleteMove)

module.exports=router
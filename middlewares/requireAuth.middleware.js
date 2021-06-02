const { end } = require('pdfkit')
const logger = require('../services/logger.service')

module.exports = {
    requireAuth,
    requireAdmin
}

async function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        res.status(401).end('Unauthorized! Please login')
        return
    }
    next()
}

async function requireAdmin(req,res,next){
    const user=req.session.user
    if(!user.isAdmin){
        logger.warn(user.fullname + 'Attemtmp to perform admin action')
        res.status(403).end('Unauthorized Enough...')
        return
    }
    next()
}
const logger= require('../services/logger.service')

module.exports={
    log
}

async function log(req,res,next){
    if (req.session && req.session.user){
        logger.info('Req from:' +req.session.user.fullname)
    }
    next()
}


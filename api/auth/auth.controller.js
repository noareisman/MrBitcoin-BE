const authService = require('./auth.service')
const logger = require('../../services/logger.service')

module.exports = {
    login,
    logout,
    signup
}


async function login(req, res) {
    const { username, password } = req.body
    try {
        const user=await authService.login(username,password)
        req.session.user = user//initializing server side session cookie
        // req.session.loginAt = Date.now()//initializing server side session cookie
        // res.cookie('loggedinUser',JSON.stringify(user))
        res.json( user)
    } catch (err) {
        logger.error('Failed to login' + err)
        res.status(403).send({ err: 'Invalid username/password' })
    }
}

async function signup(req, res) {
    try{
    const { fullname, username, password } = req.body
    const user = { fullname, username, password }
    const account=await authService.signup(username,password,fullname)
    logger.debug('auth.route - new account created:' +JSON.stringify(account))
    // const loggedinUser=await authService.login(username,password)
    // req.session.loggedinUser=loggedinUser
    // res.json(loggedinUser)
    res.json(account._id)
    } catch(err) {
        logger.error('Failed to signup',+err)
        res.status(500).send({err:'failed to signup'})
    }
}

async function logout(req, res) {
    try{
        // res.clearCookie('userIdCookie')
        req.session.destroy()//end session for the specific user
        res.end()
    }catch(err){
        logger.error('Failed to logout',+err)
        res.status(500).send({err:'failed to logout'})

    }
}


//TODO: forgot password?
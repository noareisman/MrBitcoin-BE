const bcrypt = require('bcrypt')
const userService= require('../user/user.service2')
const logger= require('../../services/logger.service')

module.exports={
    login,
    signup
}

async function login(username,password){
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.getByUsername(username)
    if(!user) return Promise.reject('Invalid username or password')
    console.log('user.password',user.password, 'password',password);
    const match= await bcrypt.compare(password, user.password)
    console.log('match',match);
    if (!match) return Promise.reject('invalid username or password')
        // const userToReturn={_id:user._id,username:user.username}
    const userToReturn={...user}
    delete userToReturn.password
    // console.log(userToReturn);
    return userToReturn
}

async function signup(username,password,fullname){
    const saltRounds=10

    logger.debug(`auth.service - signup with username: ${username},fullname:${fullname}`)
    if (!username||!password||!fullname) return Promise.reject('fullname, username and password are all requested')

    const hash=await bcrypt.hash(password,saltRounds)
    return userService.save({username,password:hash,fullname})
}
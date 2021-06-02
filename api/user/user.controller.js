const userService = require('./user.service2')
const logger=require('../../services/logger.service')

module.exports={
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    addUser
}

async function getUser(req,res){
    try{
        const user=await userService.getById(req.params.id)
        res.send(user)
    }catch(err){
        logger.error('Failed to get user',err)
        res.status(500).send({err:'Failed to get user'})
    }
}

async function getUsers(req,res){
    try{
        // const filterBy=req.query
        const users=await userService.query(filterBy={})
        res.send(users)
    }catch(err){
        logger.error('Failed to get users',err)
        res.status(500).send({err:'Failed to get users'})
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        console.log('req.body',req.body);
        // const savedUser = await userService.update(user)
        const savedUser = await userService.save(user)
        console.log('saved user',savedUser);
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function addUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.save(user)
        // const savedUser = await userService.add(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to add user', err)
        res.status(500).send({ err: 'Failed to add user' })
    }
}


//********FOR WORKING WITH MONGO-DB AS DB********
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
//***********************************************//

const utilService = require('../../services/util.service')

module.exports = {
    query,
    getById,
    remove,
    add,
    update,
    getByUsername,
    // save
}

const PAGE_SIZE = 6

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')//creating connection
        // console.log('connected to mongo');
        const users = await collection.find(criteria).toArray()         
        return users
    } catch (err) {
        console.log(`ERROR: Cannot get users`)
        throw err

    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.term) {
        const txtCriteria = { $regex: filterBy.term, $options: 'i' }
        criteria.$or = [
            {
                fullname: txtCriteria
            }
        ]
    }
    return criteria
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')//creating connection
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        console.log(user);
        // delete user.password
        return user
    } catch (err) {
        console.log(`ERROR:cannot find user by id: ${userId}`)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        console.log('got user:',user)
        return user
    } catch (err) {
        logger.error(`while finding contact ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const query = { '_id': ObjectId(userId) }
        // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of user or admin can make changes
        const collection = await dbService.getCollection('user')//creating connection
        return await collection.deleteOne(query)
    } catch (err) {
        console.log(`ERROR:cannot delete user ${userId}`)
        throw err
    }
}


async function update(user) {
    try {
        // use only updatable fields!
        const userToSave = {
            phone:user.phone,
            coins:user.coins,
            contactList:user.contactList,
            email:user.email,
            username: user.username,
            fullname:user.fullname,
            // _id:ObjectId(user._id)
        }
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const query = { '_id': ObjectId(user._id) }
        // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of user or admin can make changes
        const collection = await dbService.getCollection('user')
        await collection.updateOne(query, { $set: userToSave })
        return await collection.findOne(query)
    } catch (err) {
        console.log(`ERROR:cannot update user ${user._id}`)
        throw err
    }
}

async function add(user) {
    try {
        //use only updatable fields!
        const userToSave = {
            phone:`+1 (${utilService.getRandomInt(300,999)}) ${utilService.getRandomInt(300,999)}-${utilService.getRandomInt(1000,9999)}`,
            coins:100,
            contactList:[],
            email:`${user.username}@renovize.com`,
            username: user.username,
            password:user.password,
            fullname:user.fullname
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToSave)
        return userToSave
    } catch (err) {
        console.log(`ERROR:cannot add user ${user._id}`,err)
        throw err
    }
}



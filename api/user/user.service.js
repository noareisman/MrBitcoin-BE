//********FOR WORKING WITH JSON FILE AS DB********
const contacts = require('../../data/contact.json')
//***********************************************//


//********FOR WORKING WITH MONGO-DB AS DB********
// const dbService = require('../../services/db.service')
// const ObjectId = require('mongodb').ObjectId
//***********************************************//
const utilService = require('../../services/util.service')

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    getByUsername,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
        })
        return users
    } catch (err) {
        logger.error('ERROR: Cannot get users', err)
        throw err
    }
}

function _buildCriteria(filterBy) {

}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')//creating connection
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        console.log(`ERROR:cannot find user by id: ${userId}`)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')//creating connection
        const user = await collection.findOne({ username })
        delete user.password
        return user
    } catch (err) {
        console.log(`ERROR:cannot find user ${username}`)
        throw err
    }
}


async function remove(userId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { isAdmin } = store
        //only admin can remove users
        if (!isAdmin) {
            const collection = await dbService.getCollection('user')//creating connection
            return await collection.deleteOne({ "_id": ObjectId(userId) })
        }
    } catch (err) {
        console.log(`ERROR:cannot delete user ${userId}`)
        throw err
    }
}

async function update(user) {
    try {
        // use only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.img
        }
        const collection = await dbService.getCollection('users')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        //use only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('user')
        await collection.insetOne(userToAdd)
        return userToAdd// return from mongo with ID
    } catch (err) {
        console.log(`ERROR:cannot add user ${user._id}`)
        throw err
    }
}

// function save(user) {
//     if (user._id) {
//         const idx = gUsers.findIndex(p => { p._id === user._id })
//         if (idx < 0) Promise.reject('No such user', user._id)
//         users.splice(idx, 1, user)
//     } else {
//         user._id = utilService.makeId()
//         user.unshift(user)
//     }
//     return _saveUsersToFile()
//         .then(() => {
//             user={...user}
//             delete user.password
//             return user
//         })
// }


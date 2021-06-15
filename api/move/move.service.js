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
    // update,
}

const PAGE_SIZE = 6

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('move')//creating connection
        console.log('connected to mongo');
        const moves = await collection.find(criteria).toArray()          
        return moves
    } catch (err) {
        console.log(`ERROR: Cannot get moves`)
        throw err

    }
}
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.contactId) {
        const contactId=filterBy.contactId
        criteria.$or = [
            {
                "to._id": contactId
            },
            {
                "from._id": contactId
            }
        ]
    }
    return criteria
}

async function getById(moveId) {
    try {
        const collection = await dbService.getCollection('move')//creating connection
        const move = await collection.findOne({ '_id': ObjectId(moveId) })
        return move
    } catch (err) {
        console.log(`ERROR:cannot find move by id: ${moveId}`)
        throw err
    }
}

async function remove(moveId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const query = {'_id': ObjectId(moveId) }
        // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of move or admin can make changes
        const collection = await dbService.getCollection('move')//creating connection
        return await collection.deleteOne(query)
    } catch (err) {
        console.log(`ERROR:cannot delete move ${moveId}`)
        throw err
    }
}


// async function update(move) {
//     const collection = await dbService.getCollection('move')
//     try {
//         // use only updatable fields!
//         const moveToUpdate = {
//             _id: ObjectId(move._id),
//             from:move.from,
//             to:move.to,
//             at:move.at,
//             amount:move.amount
//         }
//         // const store = asyncLocalStorage.getStore()
//         // const { userId, isAdmin } = store
//         const query = { '_id': (move._id) }
//         // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of move or admin can make changes
//         await collection.updateOne(query, { $set: move })
//         return moveToUpdate
//     } catch (err) {
//         console.log(`ERROR:cannot update move ${move._id}`)
//         throw err
//     }
// }

async function add(move) {
    try {
        //use only updatable fields!
        const moveToAdd = {
            from:move.from,
            to:move.to,
            amount:move.amount,
            at:Date.now()
        }
        const collection = await dbService.getCollection('move')
        await collection.insertOne(moveToAdd)
        return moveToAdd
    } catch (err) {
        console.log(`ERROR:cannot add move`)
        throw err
    }
}



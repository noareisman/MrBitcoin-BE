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
}

const PAGE_SIZE = 6

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    // if (filterBy.txt) {
    //     criteria.title = { $regex: new RegExp(filterBy.txt, 'i') }
    // }
    // if (filterBy.pageIdx) {
    //     criteria.pageIdx = filterBy.pageIdx
    // }
    // if (filterBy.avgRate) {
    //     criteria.avgRate = { $gte: filterBy.avgRate }
    // }
    try {
        const collection = await dbService.getCollection('move')//creating connection
        console.log('conected to mongo');
        const moves = await collection.find(criteria).toArray()
        // const moves = await collection.find().toArray()
        // const moves = await collection.aggregate([
        //     {
        //         $match:filterBy// criteria
        //     },
        //     {
        //         //what other collection we need to look into for the aggregation
        //         $lookup:{
        //             localField:'',//property name in origin collection
        //             from:'',//origin collection name
        //             foreignField:'',//property name in other collection 
        //             as:'someName'// aggragate under this name
        //         },
        //     },
        //     {
        //         $unwind:'$someName'
        //     }
        // ]).toArray()          
        return moves
    } catch (err) {
        console.log(`ERROR: Cannot get moves`)
        throw err

    }

    // const startIdx = filterBy.pageIdx * PAGE_SIZE
    // moves = moves.slice(startIdx, startIdx + PAGE_SIZE)
    // return Promise.resolve(moves)
}
function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.term) {
        const txtCriteria = { $regex: filterBy.term, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria
            },
            {
                phone: txtCriteria
            }
        ]
    }
    return criteria
}

async function getById(moveId) {
    try {
        const collection = await dbService.getCollection('move')//creating connection
        const move = await collection.findOne({ "_id": ObjectId(moveId) })
        return move
    } catch (err) {
        console.log(`ERROR:cannot find move by id: ${moveId}`)
        throw err
    }
}

async function remove(moveId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const query = { _id: ObjectId(moveId) }
        if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of move or admin can make changes
        const collection = await dbService.getCollection('move')//creating connection
        return await collection.deleteOne(query)
    } catch (err) {
        console.log(`ERROR:cannot delete move ${moveId}`)
        throw err
    }
}


async function update(move) {
    const collection = await dbService.getCollection('move')
    try {
        // use only updatable fields!
        const moveToSave = {
            _id: ObjectId(move._id),
            createdAt:move.createdAt,
            title:move.title,
            content:move.content,
            creator:move.creator,
            comments: {
                txtComments: move.txtComments,
                rating:move.rating,
                emojiComments: move.emojiComments
            },
            attachedFiles:move.attachedFiles
        }
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const query = { _id: ObjectId(move._id) }
        if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of move or admin can make changes
        await collection.updateOne(query, { $set: move })
        return move
    } catch (err) {
        console.log(`ERROR:cannot update move ${move._id}`)
        throw err
    }
}

async function add(move) {
    try {
        //use only updatable fields!
        const moveToSave = {
            createdAt:Date.now(),
            title:move.title,
            content:move.content,
            creator:move.creator,
            comments: {
                txtComments: move.txtComments,
                rating:move.rating,
                emojiComments: move.emojiComments
            },
            attachedFiles:move.attachedFiles
        }
        const collection = await dbService.getCollection('move')
        await collection.insetOne(moveToSave)
        return moveToAdd// return from mongo with ID
    } catch (err) {
        console.log(`ERROR:cannot add move ${move._id}`)
        throw err
    }
}



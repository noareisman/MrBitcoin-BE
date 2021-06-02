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
        const collection = await dbService.getCollection('contact')//creating connection
        console.log('conected to mongo');
        const contacts = await collection.find(criteria).toArray()
        // const contacts = await collection.find().toArray()
        // const contacts = await collection.aggregate([
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
        return contacts
    } catch (err) {
        console.log(`ERROR: Cannot get contacts`)
        throw err

    }

    // const startIdx = filterBy.pageIdx * PAGE_SIZE
    // contacts = contacts.slice(startIdx, startIdx + PAGE_SIZE)
    // return Promise.resolve(contacts)
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

async function getById(contactId) {
    try {
        const collection = await dbService.getCollection('contact')//creating connection
        const contact = await collection.findOne({ "_id": ObjectId(contactId) })
        return contact
    } catch (err) {
        console.log(`ERROR:cannot find contact by id: ${contactId}`)
        throw err
    }
}

async function remove(contactId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const query = { _id: ObjectId(contactId) }
        if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of contact or admin can make changes
        const collection = await dbService.getCollection('contact')//creating connection
        return await collection.deleteOne(query)
    } catch (err) {
        console.log(`ERROR:cannot delete contact ${contactId}`)
        throw err
    }
}


async function update(contact) {
    const collection = await dbService.getCollection('contact')
    try {
        // use only updatable fields!
        const contactToSave = {
            _id: ObjectId(contact._id),
            createdAt:contact.createdAt,
            title:contact.title,
            content:contact.content,
            creator:contact.creator,
            comments: {
                txtComments: contact.txtComments,
                rating:contact.rating,
                emojiComments: contact.emojiComments
            },
            attachedFiles:contact.attachedFiles
        }
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const query = { _id: ObjectId(contact._id) }
        if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of contact or admin can make changes
        await collection.updateOne(query, { $set: contact })
        return contact
    } catch (err) {
        console.log(`ERROR:cannot update contact ${contact._id}`)
        throw err
    }
}

async function add(contact) {
    try {
        //use only updatable fields!
        const contactToSave = {
            createdAt:Date.now(),
            title:contact.title,
            content:contact.content,
            creator:contact.creator,
            comments: {
                txtComments: contact.txtComments,
                rating:contact.rating,
                emojiComments: contact.emojiComments
            },
            attachedFiles:contact.attachedFiles
        }
        const collection = await dbService.getCollection('contact')
        await collection.insetOne(contactToSave)
        return contactToAdd// return from mongo with ID
    } catch (err) {
        console.log(`ERROR:cannot add contact ${contact._id}`)
        throw err
    }
}



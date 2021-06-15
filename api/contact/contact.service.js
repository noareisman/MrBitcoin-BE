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
    // save
}

const PAGE_SIZE = 6

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('contact')//creating connection
        console.log('connected to mongo');
        const contacts = await collection.find(criteria).toArray()         
        return contacts
    } catch (err) {
        console.log(`ERROR: Cannot get contacts`)
        throw err

    }
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
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const query = { '_id': ObjectId(contactId) }
        // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of contact or admin can make changes
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
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        }
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const query = { '_id': ObjectId(contact._id) }
        // if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of contact or admin can make changes
        await collection.updateOne(query, { $set: contactToSave })
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
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        }
        const collection = await dbService.getCollection('contact')
        await collection.insertOne(contactToSave)
        return contactToAdd// return from mongo with ID
    } catch (err) {
        console.log(`ERROR:cannot add contact ${contact._id}`,err)
        throw err
    }
}



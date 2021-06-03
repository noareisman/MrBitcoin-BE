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
    save,
}

const PAGE_SIZE = 6

function query(filterBy = {}) {
    // const regex = new RegExp(filterBy.txt, 'i')
    // var posts = posts.filter(post => { regex.test(post.title) || regex.test(post.content) })
    // const startIdx = filterBy.pageIdx * PAGE_SIZE
    // posts = posts.slice(startIdx, startIdx + PAGE_SIZE)
    return Promise.resolve(contacts)
}


function getById(contactId) {
    const contact = contacts.find(contact => {
        return contact._id === contactId})
    console.log(contact);
    return Promise.resolve(contact)
}
// function remove(contactId,creatorId) {
function remove(contactId) {
    console.log('removing');
    const idx = contacts.findIndex(contact => contact._id === contactId)
    if (idx < 0) Promise.reject('No such contact', contact._id)
    // if (contacts[idx].creator._id!==creatorId) Promise.reject('Unauthorized! not contact owner')
    contacts.splice(idx, 1)
    return _saveContactsToFile()
}

function save(contact) {
    if (contact._id) {
        const idx = contacts.findIndex(c =>  c._id === contact._id )
        if (idx < 0) Promise.reject('No such contact', contact._id)
        contacts.splice(idx, 1, contact)
    } else {
        contact._id = utilService.makeId()
        contacts.unshift(contact)
    }
    return _saveContactsToFile()
        .then(() => contact)
}

function _saveContactsToFile() {
    return new Promise((resolve, reject) => {
        const fs = require('fs')
        fs.writeFile('data/contact.json', JSON.stringify(contacts, null, 2), (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}


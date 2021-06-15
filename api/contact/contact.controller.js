// const contactService = require('./contact.service2') //when not using MongoDB
const contactService = require('./contact.service') //when using MongoDB
const logger = require('../../services/logger.service')

module.exports = {
    getContact,
    getContacts,
    deleteContact,
    updateContact,
    addContact,
}

//get (filtered) contacts list
async function getContacts(req, res) {
    try {

        // const filterBy = {
        //     txt: req.query.txt || '', //TODO: Add txt filter
        //     pageIdx: +req.query.pageIdx || 0  //TODO: Add pagination filter
        // }
        const contacts = await contactService.query(filterBy = {})
        res.json(contacts)
    } catch (err) {
        logger.error('Failed to get contacts', err)
        res.status(500).send({ err: 'Failed to get contacts' })
    }
}

//get contact by ID
async function getContact(req, res) {
    try {
        // const loggedinUser = req.session.user//server side session
        const contact = await contactService.getById(req.params.id)
        // if (!loggedinUser) {
        //     //cookie -last visited contacts:
        //     var lastVisitedContacts = JSON.parse(req.cookies.lastVisitedContacts || null)
        //     if (lastVisitedContacts > 10) {
        //         return res.status(401).send('wait 1h or register to keep exploring the application')
        //     }
        //     lastVisitedContactsCookie = JSON.stringify(lastVisitedContacts)
        //     lastVisitedContacts.unshift(contactId)
        //     res.cookie('lastVisitedContacts', lastVisitedContactsCookie, { maxAge: 60 * 60 * 1000 })
        //     console.log('user visited', lastVisitedContacts)
        // }
        res.send(contact);
    } catch (err) {
        logger.error('Failed to get contact', err)
        res.status(500).send({ err: 'Failed to get contact' })
    }
}
//add contact
async function addContact(req, res) {
    try {
        // // const loggedinUser=JSON.parse(req.cookies.loggedinUser||null)//cookie -loggedin user
        // const loggedinUser = req.session.user//server side session/////////////////////////////////////////////////////UNDOCOMMENT
        // // if (!loggedinUser) return res.status(401).send('Please login')//checked by middleware requireAuth
        // const contactOwner = {
        //     _id: loggedinUser._id,
        //     fullname: loggedinUser.fullname,
        //     img: loggedinUser.img
        // }
        const { name, email, phone } = req.body
        const contact = { name, email, phone }
        const savedContact = await contactService.add(contact)
        // const savedContact = await contactService.save(contact) //when not using MongoDB
        res.send(savedContact)
    } catch (err) {
        logger.error('Failed to adder', err)
        res.status(500).send({ err: 'Failed to add contact' })
    }
}
//update contact
async function updateContact(req, res) {
    try {
        const { _id, name, email, phone } = req.body
        const contact = { _id, name, email, phone }
        const savedContact = await contactService.update(contact)
        // const savedContact = await contactService.save(contact) //when not using MongoDB 
        res.send(savedContact)
    } catch (err) {
        logger.error('Failed to update contact', err)
        res.status(500).send({ err: 'Failed to update contact' })
    }
}

//remove contact by ID
async function deleteContact(req, res) {
    try {
        await contactService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete contact', err)
        res.status(500).send({ err: 'Failed to delete contact' })
    }
}

//********FOR WORKING WITH JSON FILE AS DB********
const users = require('../../data/user.json')
//***********************************************//

//********FOR WORKING WITH MONGO-DB AS DB********
// const dbService = require('../../services/db.service')
// const ObjectId = require('mongodb').ObjectId
//***********************************************//

const utilService = require('../../services/util.service')
const { updateUser } = require('./user.controller')

module.exports = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

const PAGE_SIZE = 6

// function query(filterBy = {}) {
//     // const regex = new RegExp(filterBy.txt, 'i')
//     // var posts = posts.filter(post => { regex.test(post.title) || regex.test(post.content) })
//     // const startIdx = filterBy.pageIdx * PAGE_SIZE
//     // posts = posts.slice(startIdx, startIdx + PAGE_SIZE)
//     return Promise.resolve(users)
// }

function query(filterBy={}) {
    console.log(filterBy);
    var filteredUsers=users;
    if (filterBy.fullname){
        filteredUsers=users.filter(user=>{
            return user.fullname.toLocaleLowerCase().includes(filterBy.fullname.toLocaleLowerCase())})
        }
        
        console.log(filteredUsers);
    return Promise.resolve(filteredUsers)
}

function getById(userId) {
    const user = users.find(user => {
        return user._id === userId})
    console.log(user);
    return Promise.resolve(user)
}

async function getByUsername(username) {
    try {
        const user = await users.find(user=> user.username===username)
        console.log('get by username include password ',user.password);
        return user
    } catch (err) {
        console.log(`ERROR:cannot find user ${username}`)
        throw err
    }
}
// function remove(userId,creatorId) {
function remove(userId) {
    console.log('removing');
    const idx = users.findIndex(user => user._id === userId)
    if (idx < 0) Promise.reject('No such user', user._id)
    // if (users[idx].creator._id!==creatorId) Promise.reject('Unauthorized! not user owner')
    users.splice(idx, 1)
    return _saveUsersToFile()
}

async function save(user) {
    console.log('userService.save-user._id:',user._id);
    if (user._id) {
        const prevUser=await getById(user._id)
        console.log('prev user:',prevUser.password);
        user.password=prevUser.password
        const idx = users.findIndex(c =>  c._id === user._id )
        if (idx < 0) Promise.reject('No such user', user._id)
        users.splice(idx, 1, user)
        console.log('password post slice:',user.password);
    } else {
        user._id = utilService.makeId(24)
        user.phone=`+1 (${utilService.getRandomInt(300,999)}) ${utilService.getRandomInt(300,999)}-${utilService.getRandomInt(1000,9999)}`
        user.coins=100
        user.contactList=[]
        user.email=`${user.username}@renovize.com`
        users.unshift(user)
    }

    const userToReturn={...user}
    delete userToReturn.password
    return _saveUsersToFile()
        .then(() => userToReturn)
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const fs = require('fs')
        fs.writeFile('data/user.json', JSON.stringify(users, null, 2), (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}


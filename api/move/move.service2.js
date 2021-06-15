//********FOR WORKING WITH JSON FILE AS DB********
const moves = require('../../data/move.json')
//***********************************************//

const utilService = require('../../services/util.service')

module.exports = {
    query,
    getById,
    remove,
    save,
}

// const PAGE_SIZE = 6

function query(filterBy={}) {
    if (filterBy.userId){
        moves=moves.filter(move=>{
            return (move.to._id===userId || move.from._id===userId)})
    }
    return Promise.resolve(moves)
}

function getById(moveId) {
    const move = moves.find(move => {
        return move._id === moveId})
    console.log(move);
    return Promise.resolve(move)
}

function remove(moveId) {
    console.log('removing');
    const idx = moves.findIndex(move => move._id === moveId)
    if (idx < 0) Promise.reject('No such move', move._id)
    moves.splice(idx, 1)
    return _saveMovesToFile()
}

function save(move) {
    if (move._id) {
        const idx = moves.findIndex(m =>  m._id === move._id )
        if (idx < 0) Promise.reject('No such move', move._id)
        moves.splice(idx, 1, move)
    } else {
        move._id = utilService.makeId()
        moves.unshift(move)
    }
    return _saveMovesToFile()
        .then(() => move)
}

function _saveMovesToFile() {
    return new Promise((resolve, reject) => {
        const fs = require('fs')
        fs.writeFile('data/move.json', JSON.stringify(moves, null, 2), (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}


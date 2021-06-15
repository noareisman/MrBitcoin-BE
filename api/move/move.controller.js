const moveService = require('./move.service')//when using mongo
// const moveService = require('./move.service2')//when not using mongo
const logger = require('../../services/logger.service')

module.exports = {
    getMove,
    getMoves,
    deleteMove,
    updateMove,
    addMove,
}

//get (filtered) moves list
async function getMoves(req, res) {
    try {
        // const filterBy = {
        //     user: req.query.user || '',
        // }
        const moves = await moveService.query(filterBy={})
        res.json(moves)
    } catch (err) {
        logger.error('Failed to get moves', err)
        res.status(500).send({ err: 'Failed to get moves' })
    }
}

//get move by ID
async function getMove(req, res) {
    try {
        const move = await moveService.getById(req.params.id)
        console.log(req.params.id);
        res.send(move);
    } catch (err) {
        logger.error('Failed to get move', err)
        res.status(500).send({ err: 'Failed to get move' })
    }
}

async function addMove(req, res) {
    try {
        const { from,to,at,amount } = req.body
        const move = { from,to,at,amount }
        const savedMove = await moveService.add(move)// when using mongoDB
        console.log('move-controller - savedMove:',savedMove);
        // const savedMove = await moveService.save(move)// when not using mongoDB
        res.send(savedMove)
    } catch (err) {
        logger.error('Failed to add move', err)
        res.status(500).send({ err: 'Failed to add move' })
    }
}

//update move
async function updateMove(req, res) {
    try {
        const { _id, from,to,at,amount } = req.body
        const move = { _id, from,to,at,amount  }
        const savedMove = await moveService.update(move)// when using mongoDB
        // const savedMove = await moveService.save(move)// when not using mongoDB
        res.send(savedMove)
    } catch (err) {
        logger.error('Failed to update move', err)
        res.status(500).send({ err: 'Failed to update move' })
    }
}

//remove move by ID
async function deleteMove(req, res) {
    try {
        await moveService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete move', err)
        res.status(500).send({ err: 'Failed to delete move' })
    }
}

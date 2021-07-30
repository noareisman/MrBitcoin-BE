// const orderService = require('../api/order/order.service')
// const userService = require('../api/user/user.service')
// const stayService = require('../api/stay/stay.service')
const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}//key:sessionID value:socket

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
 
    const sharedSession = require('express-socket.io-session');
    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {//creating a new socket. The same as writing: function(socket){...}
        console.log('a user connected');
        // console.log('socket.handshake', socket.handshake)
        // console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
        // Updating sessionToSocket map:
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        //If the session belongs to a connected user - it joins a room named after the userId:
        if (socket.handshake?.session?.user) socket.join(socket.handshake.session.user._id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        //chat topic variation:
        socket.on('chat topic', topic=>{
            if (socket.myTopic===topic)return//if already connected to the right channel
            if (socket.myTopic){
                socket.leave(socket.myTopic)//leave current channel
            }
        })
        socket.on('setTransfer',(move)=>{
            // console.log(' socket service on setTransfer',move )
            // console.log(socket.id)
            // to=move.to.id
            // const userSocketId = socket.id
            gIo.emit ('loadOrders' ,host ) 
            // gIo.to(hostId).emit('loadOrders', host) 
        })
        socket.on('updateAns', (order)=>{
            console.log(' socket service line 44',order )
            gIo.emit ('updatedAns' ,order ) 
            
        })
        //private chat room
        socket.on("private message", (anotherSocketId, msg) => {
            socket.to(anotherSocketId).emit("private message", socket.id, msg);
        });
        //send all:
        //gIo.to('room1').emit('msg','content)
        //send to all in room but the sender:
        //socket.broadcast.to('room2').emit('msg','content')

    } ) 
    

}

//IFAT
function emit({ type, data }) {
    console.log('in emit!')
    gIo.emit(type, data)
}
//
// private message
function emitToUser({ type, data, userSocketId }) {
    gIo.emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    // emitToAll,/////////////////////////////////////////////////////// ERAN
    broadcast,
    emit,
    emitToUser
}




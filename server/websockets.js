let io = null
let socketClients = {}

const addClient = (userId, socketId) => {
  if (userId) {
    if (socketClients[userId]) {
      socketClients[userId].push(socketId)
    } else {
      socketClients[userId] = [socketId]
    }
  }
  //console.log('ADDCLIENT ', userId, socketId, socketClients)
} 

const removeClient = (userId, socketId) => {
  if (userId) {
    socketClients[userId] = socketClients[userId].filter(id => id != socketId)
  }
  //console.log('RMCLIENT ', userId, socketId, socketClients)
}

exports.io = () => io

exports.socketClients = () => socketClients

exports.emitToUser = (userId, message, data) => {
  if (socketClients[userId]) {
    for (let socketId of socketClients[userId]) {
      io.sockets.sockets.get(socketId).emit(message, data)
    } 
  }
}

exports.init = (server, options={}) => {
  io = require('socket.io')(server, options) 

  io.on('connection', socket => {
    //console.log('SOCKET: connect')
    addClient(socket.handshake.session.userId, socket.id)

    socket.on('disconnect', () => {
      //console.log('SOCKET: disconnect')
      removeClient(socket.handshake.session.userId, socket.id)
    })
  })
  return io
}
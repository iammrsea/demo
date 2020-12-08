import Websocket from 'App/Services/Websocket';

Websocket.start((socket) => {
    socket.emit('news', { hello: 'world' })

    console.log(socket.request.url)
    Websocket.getIo().emit(socket.id, { id: socket.id, text: `Your id is ${socket.id}` })
    socket.emit('id', socket.id)
})

var net = require('net');

const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log(data.toString())
        socket.destroy()
    })
}).listen(3000)
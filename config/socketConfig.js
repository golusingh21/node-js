const {createServer} = require('http');
const {Server} = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {});

function socketServer(){
    return httpServer.listen(3001, () => {
        console.log(`Server is running on http://localhost:${3001}`);
    });
}

module.exports = {socketServer, io};
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1500;

app.use(express.static(__dirname + '/public'));

function onConnection(socket) {
    function drawData(data) {
    	console.log("data",data);
        socket.broadcast.emit('drawing', data);
    }
    socket.on('drawing', drawData);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

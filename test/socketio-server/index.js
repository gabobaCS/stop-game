var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = []
io.on('connection', function(socket){
    console.log('a user connected');

    socket.emit('roomlist', rooms);

    socket.on('create room', (room) => {
      if (!rooms.includes(room) && room != ''){
        rooms.push(room);
        io.sockets.emit('roomlist', rooms);
        console.log('here');  
      }  
    })

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('join room', (roomName) => {
      socket.join(roomName);
      console.log(roomName)
      io.in(roomName).emit('message', 'test message to room: '+ roomName)
    })

  });

http.listen(4000, function(){
  console.log('listening on *:4000');
});








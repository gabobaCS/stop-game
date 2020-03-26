var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = [];
let users_in_room;

io.on('connection', function (socket) {
  console.log(`a user connected ${socket.id}`);

  socket.emit('roomlist', rooms);


  socket.on('create room', (room) => {
    if (!rooms.includes(room) && room != '') {
      rooms.push(room);
      io.sockets.emit('roomlist', rooms);
      console.log('here');
      users_in_room = [];
    }
  })


  socket.on('join room', (roomName) => {

    socket.join(roomName);
    console.log(roomName)
    // io.in(roomName).emit('message', 'test message to room: '+ roomName)
    io.in(roomName).emit('socket id', socket.id)
    io.in(roomName).clients((err, clients) => {
      io.sockets.emit('client list', clients);
      console.log(clients);
    });
    socket.on('new player', (user_name) => {
      
      users_in_room.push(user_name);
      io.in(roomName).emit('users in room', users_in_room);
    });
    io.in(roomName).emit('users in room', users_in_room);
  })



  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(4000, function () {
  console.log('listening on *:4000');
});








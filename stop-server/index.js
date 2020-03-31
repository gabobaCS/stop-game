var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let connectedUsers = [{username:'ddd', room: null, id: 'ARBITRARYID'}, {username:'gabo', room: null, id: 'ARBITRARYID1'}]; //List of objects: [{username, id, room}]
let existingRooms = [{roomName: 'Test', categories: ['food', 'country'], inputType: 'pen-and-paper', usersInRoom: []}]

function userInConnectedUsers(user, connectedUsersList) {
  var i;
  for (i = 0; i < connectedUsersList.length; i++) {
    if (connectedUsersList[i].username == user) {
      return true;
    }
  }
  return false;
}

function stringInListOfObjects(str, listOfObjects, property){
  var i;
  for (i = 0; i < listOfObjects.length; i++){
    if (listOfObjects[i][property] == str){
      return true;
    }
  }
  return false;
}

io.on('connection', function(socket){
  console.log('Current connected users: ')
  console.log(connectedUsers)
  console.log('user connected: ' + socket.id)

  socket.on('try login', (username) => {
    console.log(username + ' is trying to log in')
    //Checks if username is already in list of connected users.
    if (userInConnectedUsers(username, connectedUsers)){
      console.log('Access denied')
      socket.emit('username already in use')
    }
    else {
      //Connects user and adds it to list.
      connectedUsers.push({'username':username, 'room': null, 'id':socket.id})
      console.log(username + ' has logged in')
      //Informs client that login was successful
      socket.emit('succesful login', username)
      console.log('Current connected users: ')
      console.log(connectedUsers)
    }
  })

  socket.on('create room', (roomObject) => {
    //Checks if room is already created in existingRooms.
    if (!stringInListOfObjects(roomObject.roomName, existingRooms, 'roomName')){
      existingRooms.push(roomObject);
      socket.emit('room created succesfully')
      //Sends info to all connections to update /rooms route.
      io.sockets.emit('list of rooms', existingRooms)
    }
    else{
      socket.emit('invalid room')
    }
    console.log('Existing rooms:')
    console.log(existingRooms)
  })

  socket.on('request list of rooms', () => {
    console.log(socket.id)
    socket.emit('list of rooms', existingRooms)
    // socket.removeAllListeners('request list of rooms')
    
  })

  socket.on('join room', (userObject) => {
    //Checks if user is already logged in to room
    let i;
    for (i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].username == userObject.username) {
        console.log(userObject.username + ' is trying to join: ' + userObject.room)
        if (connectedUsers[i].room != userObject.room){
          socket.join(userObject.room);
          connectedUsers[i].room = userObject.room;
          console.log(userObject.username + ' has joined: ' + userObject.room);
          console.log(connectedUsers)
          io.sockets.in(userObject.room).emit('succesful room join', userObject)
          break
        }
      }
    }
  })

  socket.on('leave room', (userObject) => {    
    let i;
    for (i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].username == userObject.username) {
        console.log(userObject.username + ' is leaving: ' + userObject.room)
        connectedUsers[i].room = null
        socket.leave(userObject.room)
        // socket.removeAllListeners('request list of rooms')
        break
      }
    }
    console.log(connectedUsers)
  })



  socket.on('disconnect', function(){
    //Remove user from connectedUsers List
    let i;
    for (i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].id == socket.id) {
        connectedUsers.splice(i, 1)
        break
      }
    }
    console.log('user disconnected');
    console.log('current connected users: ')
    console.log(connectedUsers)
  });

});

http.listen(4000, function(){
  console.log('listening on *:4000');
});








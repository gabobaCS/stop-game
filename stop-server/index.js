var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let connectedUsers = [{username:'ddd', room: null, id: 'ARBITRARYID'}, {username:'gabo', room: null, id: 'ARBITRARYID1'}]; //List of objects: [{username, id, room}]

function userInConnectedUsers(user, connectedUsersList) {
  var i;
  for (i = 0; i < connectedUsersList.length; i++) {
    if (connectedUsersList[i].username == user) {
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
      socket.emit('succesful login', connectedUsers)
      console.log('Current connected users: ')
      console.log(connectedUsers)

    }

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








var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let connectedUsers = [{username:'ddd', room: null, id: 'ARBITRARYID'}, {username:'gabriel', room: 'TEST', id: 'ARBITRARYID1'}]; //List of objects: [{username, id, room}]
let existingRooms = [{roomName: 'TEST', gameState:'lobby', categories: ['food', 'country'], inputType: 'pen-and-paper', usersInRoom: [{username:'gabriel', playerReady: true, points: 0}]}];
let roomsAnswers = []


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

function indexOfObjectProp(listOfObjects, property, target){
  for (let i = 0; i < listOfObjects.length; i++){
    if (listOfObjects[i][property] == target)
    return i
  }
}

function allUsersInRoomReady(listOfObjects, property){
  for (let i = 0; i < listOfObjects.length; i++){
    if (!listOfObjects[i][property]){
      return false
    }
  }
  return true
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
      existingRooms.unshift(roomObject);
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
    for (let i = 0; i < connectedUsers.length; i++) {
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
    //Adds user to room object.
    for (let i = 0; i < existingRooms.length; i++){
      
      if (existingRooms[i].roomName == userObject.room){
        existingRooms[i].usersInRoom.push({username:userObject.username, playerReady: false, points: 0});
        io.to(existingRooms[i].roomName).emit('room data', existingRooms[i])
        break;
      }
    }
    console.log(existingRooms)
  })

  socket.on('leave room', (userObject) => {    
    for (let i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].username == userObject.username) {
        console.log(userObject.username + ' is leaving: ' + userObject.room)
        connectedUsers[i].room = null;
        socket.leave(userObject.room)
        break
      }
    }
    //Removes User from existingRooms list.
    for (let i = 0; i < existingRooms.length; i++){
      if (existingRooms[i].roomName == userObject.room){
        console.log('Deleting ' + userObject.username +' from: ' + userObject.room);
        let targetIndex = indexOfObjectProp(existingRooms[i].usersInRoom, 'username', userObject.username) ;
        existingRooms[i].usersInRoom.splice(targetIndex, 1)
        console.log('Removing from existingRooms')
        console.log(existingRooms[i].usersInRoom);
        io.to(userObject.room).emit('room data', existingRooms[i])

      }
    }
    console.log(existingRooms.usersInRoom) 
    console.log(connectedUsers)
  })

  /*Handling Game Room*/
    // socket.on('request usersList', (roomName) => {
    //   //Iterates over existingRooms to send appropiate roomObject.
    //   for (let i = 0; i < existingRooms.length; i++){
    //     if (existingRooms[i].roomName == roomName){
    //       io.to(roomName).emit('users in room', existingRooms[i].usersInRoom)
    //     }
    //   }
    // })

    //Serves room data.
    socket.on('request room data', (roomName) => {
      console.log('Requesting:')
      console.log( existingRooms[indexOfObjectProp(existingRooms, 'roomName', roomName)])
      io.to(roomName).emit('room data', existingRooms[indexOfObjectProp(existingRooms, 'roomName', roomName)]);
    })


    //Receives player ready action.
    socket.on('player ready', (userObject) => {
      console.log('here')
      console.log(userObject)
      let existingRoomsIndex = indexOfObjectProp(existingRooms, 'roomName', userObject.roomName);
      let usersInRoomIndex = indexOfObjectProp(existingRooms[existingRoomsIndex].usersInRoom, 'username', userObject.username);
      //Sets user to active playerReady state
      existingRooms[existingRoomsIndex].usersInRoom[usersInRoomIndex].playerReady = true;
      console.log('EXISTING ROOMS TARGET')  
      console.log(existingRooms[existingRoomsIndex].usersInRoom[usersInRoomIndex])
      //Emits updated users list
      let targetRoom = existingRooms[indexOfObjectProp(existingRooms, 'roomName', userObject.roomName)]
      io.to(userObject.roomName).emit('room data', targetRoom)
      if(allUsersInRoomReady(targetRoom.usersInRoom, 'playerReady')){
        console.log('ALL PLAYERS READY FROM LOBBY:' + targetRoom.roomName)
        targetRoom.gameState = 'gameInProgress'
        io.to(targetRoom.roomName).emit('all players ready in lobby', targetRoom)        
      }      
    })

    //Handles Stop.
    socket.on('stop request', (roomName) =>{
      console.log('STOP IN:' + roomName)
      io.to(roomName).emit('handle stop')
    })
    
    socket.on('stop data', (categoriesUserObject) => {
      console.log('received signal from:' + categoriesUserObject.username)
      /*TODO: HANDLE MULTIPLE DATA TO CHECK THAT STOP DATA RECEIVED AND POINT EVALUATION*/
      // console.log(categoriesUserObject);
      // roomsAnswers.push(categoriesUserObject)
      // console.log(roomsAnswers)
    })


  



  socket.on('disconnect', function(){
    //Remove user from connectedUsers List
    var i;
    for (i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].id == socket.id) {

        //After determing username, removes user from existingRooms.
        for (let n = 0; n < existingRooms.length; n++){
          if (existingRooms[n].roomName == connectedUsers[i].room){

            let targetIndex = indexOfObjectProp(existingRooms[n].usersInRoom, 'username', connectedUsers[i].username) ;
            existingRooms[n].usersInRoom.splice(targetIndex, 1)
            console.log('Users in exising Room after disconnect:')
            console.log(existingRooms[n].usersInRoom)
            io.to(existingRooms[n].roomName).emit('room data', existingRooms[n])
            // let target = existingRooms[n].usersInRoom.indexOf(connectedUsers[i].username);
            // existingRooms[n].usersInRoom.splice(target, 1)
          }
        }
        connectedUsers.splice(i, 1);
        break
      }
    }
    console.log('user disconnected');
    console.log('current connected users: ')
    console.log(connectedUsers)
    console.log('Current Rooms:')
    console.log(existingRooms)
  });

});

http.listen(4000, function(){
  console.log('listening on *:4000');
});








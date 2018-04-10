var express = require('express');
var app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running!!!");
app.get('/', function(request, responce)
{
  responce.sendFile(__dirname + '/client.html');
});


//open a connection with socketIO
io.sockets.on('connection', function(socket)
{
  //all events are in here

  //push the new connected socket to our array of connections
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);


  //disconnect...
  // this will be called automatically when the user closes the browser.
  socket.on('disconnect', function(data){

    //if there wasnt a username, then do nothing.
    // if(!socket.username)
    // {
    //   return;
    // }
    // else {
      users.splice(users.indexOf(socket.username), 1);

      //refresh the list of users.
      updateUsernames();

      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected...', connections.length);

    // }


  });


  //send message
  socket.on('send message', function(data){
    console.log("message data: " +  data);
    io.sockets.emit('new message', {msg: data, user: socket.username, location: socket.location});
  });



  //new user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.location = data.location;
    socket.username = data.username;
    users.push(socket.username);
    updateUsernames();
  });


  //this function refreshes the list of connected users.
  function updateUsernames()
  {
    io.sockets.emit('get users', users);
  }



});

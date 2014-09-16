var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./'));

io.on('connection', function(socket){
  socket.on('key', function(msg){
    console.log('key', msg)
    io.emit('key', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
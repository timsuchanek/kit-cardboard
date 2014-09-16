var socket = io();
var $body = document.querySelector('body');
$body.addEventListener('keydown', function(e) {
  socket.emit('key', {
    code: e.keyCode
  });
});

socket.on('key', function(key) {
  console.log(key);
});
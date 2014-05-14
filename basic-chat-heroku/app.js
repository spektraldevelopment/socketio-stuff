var 
  app = require('express')(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  clientList = io.sockets.clients('superroom'),
  port = Number(process.env.PORT || 8888);

server.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

  socket.join('superroom');

  socket.broadcast.to('superroom').emit('arrived', socket.id);

  console.log(io.sockets.clients('superroom'));
  
  socket.emit('connected', { clientID: socket.id });

  socket.on('message', function(data) {
    socket.broadcast.to('superroom').emit('onmessage', { client: data.client, message: data.message } );
    console.log('Server: message: ' + data.message);
  });
});


var argv = require('optimist')
            .usage('Usage: $0 --url [url to webtail]')
            .demand(['url'])
            .argv;

configureReader(connect());

function connect() {
  var url = argv.url;
  var parsedUrl = parseUrl(url);
  var socket = require('socket.io-client').connect(parsedUrl.server);
  socket.on('ready', function() {
    console.log('Tailing to ', url);
    process.stdin.resume();
  });
  socket.emit('id', parsedUrl.id);
  return socket;
}

function parseUrl(url) {
  var lastSlash = url.lastIndexOf('/');
  return {
    server: url.substring(0, lastSlash),
    id: url.substring(lastSlash + 1)
  };
}

function configureReader(socket) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    chunk.split("\n").forEach(function(line) {
      socket.emit('chunk', line);
    });
  });
}
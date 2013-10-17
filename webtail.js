#!/usr/bin/env node 

var argv = require('optimist')
            .usage('Usage: $0 --url [url to webtail]')
            .demand(['url'])
            .argv;

var urlRegex = /(https?:\/\/?[^/]+)\/(.+)/;

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
  var match = urlRegex.exec(url);
  if (!match) {
    console.log("Please supply a valid url like 'http://webtail.me/Ad23Df3d'");
    process.exit(1);
  }
  return {
    server: match[1],
    id: match[2]
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
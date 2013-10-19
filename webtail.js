#!/usr/bin/env node 

var http = require('http')
  , argv = require('optimist')
            .usage('Usage: $0 --url [url to webtail] --new [file_to_tail]')
            .boolean('new')
            .demand('url')
            .argv
  , Tail = require('tail').Tail;

var urlRegex = /(https?:\/\/?[^/]+)\/(.+)/;

if (argv._.length > 0) {
  connectAndThen(readFromFile);
} else {
  connectAndThen(readFromStdIn);
}

function connectAndThen(fn) {
  if (argv['new']) {
    obtainUrlAndThen(fn);
  } else {
    prepareToStreamAndThen(argv.url, fn);
  }
}

function obtainUrlAndThen(fn) {
  var requestOptions = require('url').parse(argv.url + "?new");
  requestOptions.method = 'POST';
  var request = http.request(requestOptions, function(response) {
    if (response.statusCode != 307) {
      console.error("Got unexpected response", response);
    } else {
      var newUrl = requestOptions.protocol + "//"
                   + requestOptions.host + "/"
                   + response.headers.location;
      console.log("Tailing to " + newUrl);
      prepareToStreamAndThen(newUrl, fn);
    }
  });
  request.on('error', function(error) {
    console.log(error.message);
    process.exit(1);
  });
  request.end();
}

function prepareToStreamAndThen(url, fn) {
  var requestOptions = require('url').parse(url);
  requestOptions.method = 'POST';
  var request = http.request(requestOptions);
  request.on('error', function(error) {
    console.log(error.message);
    process.exit(1);
  });
  fn(request);
}

function readFromFile(httpRequest) {
  new Tail(argv._[0]).on("line", function(line) {
    httpRequest.write(line);
    httpRequest.write("\n");
  });
}

function readFromStdIn(httpRequest) {
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    httpRequest.write(chunk);
  });
}
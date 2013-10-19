#!/usr/bin/env node 

var usage = hereDoc(function() {/*!
    Usage: $0 [--new] [url_to_webtail] [file_to_tail]
    
    webtail can either be used by piping data to it:
    
      > tail -100lf myfile.txt | webtail http://webtail.me/ox/myfile.txt
    
    
    or it can read the file directly, in which case it behaves like tail -f:

      > webtail http://webtail.me/ox/myfile.txt myfile.txt
        
    To generate new random paths, using the --new flag:
    
      > webtail --new http://webtail.me/ox myfile
      tailing to http://webtail.me/ox/3426f2b6
*/});

var http = require('http')
  , optimist = require('optimist')
              .usage(usage)
              .options({
                'new': {
                  boolean: true,
                  describe: 'If specified, a new random path will be created under the path specified by --url'
                }
              })
  , argv = optimist.argv
  , Tail = require('tail').Tail;

if (argv._.length == 0) {
  console.log(argv);
  optimist.showHelp();
  process.exit(1);
}

var serverUrl = argv._[0];

var urlRegex = /(https?:\/\/?[^/]+)\/(.+)/;

if (argv._.length > 1) {
  connectAndThen(readFromFile);
} else {
  connectAndThen(readFromStdIn);
}

function connectAndThen(fn) {
  if (argv['new']) {
    obtainUrlAndThen(fn);
  } else {
    prepareToStreamAndThen(serverUrl, fn);
  }
}

function obtainUrlAndThen(fn) {
  var requestOptions = require('url').parse(serverUrl + "?new");
  requestOptions.method = 'POST';
  var request = http.request(requestOptions, function(response) {
    if (response.statusCode != 307) {
      console.error("Got unexpected response", response);
    } else {
      var newUrl = requestOptions.protocol + "//"
                   + requestOptions.host + "/"
                   + response.headers.location;
      console.log("tailing to " + newUrl);
      prepareToStreamAndThen(newUrl, fn);
    }
  });
  request.on('error', function(error) {
    console.log(error.message);
    process.exit(2);
  });
  request.end();
}

function prepareToStreamAndThen(url, fn) {
  var requestOptions = require('url').parse(url);
  requestOptions.method = 'POST';
  var request = http.request(requestOptions);
  request.on('error', function(error) {
    console.log(error.message);
    process.exit(3);
  });
  fn(request);
}

function readFromFile(httpRequest) {
  new Tail(argv._[1]).on("line", function(line) {
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

/**
 * Courtesy of http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript/6072388#6072388.
 * 
 * @param f
 * @returns
 */
function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
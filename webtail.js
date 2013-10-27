#!/usr/bin/env node 

var usage = hereDoc(function() {/*!

WW      WW EEEEEEE BBBBBBB  TTTTTTTT   AAA    IIII LL          MM     MM EEEEEEE
WW  WW  WW EE      BB    BB    TT     AA AA    II  LL          MMM   MMM EE
WW  WW  WW EE      BB    BB    TT    AA   AA   II  LL          MMMM MMMM EE
WW  WW  WW EEEEE   BBBBBBB     TT   AA     AA  II  LL          MM MMM MM EEEEE
WW  WW  WW EE      BB    BB    TT   AAAAAAAAA  II  LL          MM     MM EE
WW  WW  WW EE      BB    BB    TT   AA     AA  II  LL      DOT MM     MM EE
 WWW  WWW  EEEEEEE BBBBBBB     TT   AA     AA IIII LLLLLLL TOD MM     MM EEEEEEE


Usage: $0 [--new] url_to_webtail [file_to_tail]
   or: $0 login [access_token]
   
$0 login has to be run at least once to set the access token

$0 can either be used by piping data to it:

  > tail -100lf log.txt | $0 https://webtail.me/ox/log.txt

or it can read the file directly, in which case it behaves like tail -f:

  > $0 https://webtail.me/ox/log.txt log.txt
    
To generate new random paths, use the --new flag:

  > $0 --new https://webtail.me/ox myfile
  tailing to https://webtail.me/ox/3426f2b6
*/});

var optimist = require('optimist')
              .usage(usage)
              .options({
                'new': {
                  boolean: true,
                  describe: 'If specified, a new random path will be created under the given url.'
                },
                'insecure': {
                  boolean: true,
                  describe: 'If specified, all server certificates will be trusted.  Typically only used for testing with local server.'
                }
              })
              .wrap(80)
  , argv = optimist.argv
  , https = require('https')
  , read = require('read')
  , fs = require('fs')
  , accessToken = null
  , URL_REGEX = /(https?:\/\/?[^/]+)\/(.+)/
  , TOKEN_PATH = getUserHome() + '/.webtail_token';
  
if (argv._.length == 0) {
  optimist.showHelp();
  process.exit(1);
}

var serverUrl = argv._[0];

if (argv._[0] === 'login') {
  login(argv._);
} else {
  readTokenAndThenWrite();
}

function login(args) {
  if (args.length > 1) {
    saveToken(args[1]);
  } else {
    read({ prompt: 'Enter you webtail.me access token: ' }, function(err, token) {
      if (err && err.toString() === 'Error: canceled') {
        process.exit(2);
      }
      saveToken(token);
    });
  }
}

function saveToken(token) {
  fs.writeFile(TOKEN_PATH, token, function(err) {
    if (err) {
        console.error('Unable to save access token: ' + err);
    } else {
        console.log("Access token saved");
    }
  });
}

function readTokenAndThenWrite() {
  fs.readFile(TOKEN_PATH, function(err, tokenFromDisk) {
    if (err) {
      console.error("Unable to read access token, please run 'webtail login'\n" + err);
    } else {
      accessToken = tokenFromDisk.toString();
      if (!accessToken) {
        console.error("Access token was empty, please run 'webtail login'");
      } else {
        if (argv._.length > 1) {
          connectAndThen(readFromFile);
        } else {
          connectAndThen(readFromStdIn);
        }
      }
    }
  });
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
  requestOptions.headers = {
    'x-webtail-access-token': accessToken
  };
  requestOptions.rejectUnauthorized = !(argv.insecure === true);
  var request = https.request(requestOptions, function(response) {
    checkResponseStatus(response);
    var newUrl = requestOptions.protocol + "//"
                 + requestOptions.host + "/"
                 + response.headers.location;
    console.log("tailing to " + newUrl);
    prepareToStreamAndThen(newUrl, fn);
  });
  request.on('error', function(err) {
    console.error('Unable to create new url: ' + err.message);
    process.exit(3);
  });
  request.end();
}

function prepareToStreamAndThen(url, fn) {
  var requestOptions = require('url').parse(url);
  requestOptions.method = 'POST';
  requestOptions.headers = {
    'x-webtail-access-token': accessToken
  };
  requestOptions.rejectUnauthorized = !(argv.insecure === true);
  var request = https.request(requestOptions, function(response) {
    checkResponseStatus(response);
  });
  request.on('error', function(err) {
    console.error('Unable to send data: ' + err.message);
    process.exit(4);
  });
  fn(request);
}

function checkResponseStatus(response) {
  if (response.statusCode != 307) {
    if (response.statusCode == 401) {
      console.error("Authentication error.  Make sure that your base path and access token match those given to you by webtail.me.");
      process.exit(6);
    } else {
      console.error("Got unexpected response status", response.statusCode);
      process.exit(5);
    }
  }
}

function readFromFile(httpRequest) {
  var tailProcess = require('child_process').spawn('tail', ['-f', argv._[1]]);
  tailProcess.stderr.pipe(process.stderr);
  tailProcess.stdout.pipe(httpRequest);
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

/**
 * Get the home directory of the user
 * 
 * @returns
 */
function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
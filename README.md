# webtail

## Objective

webtail.me allows you to tail files to the web for sharing with other people.

`webtail` is the command-line client for doing this.

## Installation

Requires [nodejs](http://nodejs.org/)

`npm install -g webtail`

## Quick Start

Start tailing

    > webtail http://webtail.me/ox/
    tailing to http://webtail.me/ox/3426f2b6
    
Point a browser or curl at that url

    curl http://webtail.me/ox/3426f2b6
    
For HTTPS, right now you need to use https://webtail.jit.su.  We hope to support
https://webtail.me soon.

## Usage

```
Usage: node ./webtail.js [--new] [url_to_webtail] [file_to_tail]

webtail can either be used by piping data to it:

  > tail -100lf myfile.txt | webtail http://webtail.me/ox/myfile.txt

or it can read the file directly, in which case it behaves like tail -f:

  > webtail http://webtail.me/ox/myfile.txt myfile.txt

To generate new random paths, using the --new flag:

  > webtail --new http://webtail.me/ox myfile
  tailing to http://webtail.me/ox/3426f2b6


Options:
  --new  If specified, a new random path will be created under the path specified by --url
```

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

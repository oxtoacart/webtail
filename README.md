# webtail

## Objective

webtail.me allows you to tail files to the web for sharing with other people.

`webtail` is the command-line client for doing this.

## Installation

Requires [nodejs](http://nodejs.org/)

`npm install -g webtail`

## Usage

Pick an unused url on webtail.me like http://webtail.me/ox/523433

Point a browser or curl at that url

    curl http://webtail.me/ox/523433
    
Start tailing
  
    tail -1000lf logfile.txt | webtail --url http://webtail.me/ox/523433

For HTTPS, right now you need to use http://webtail.jit.su.

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

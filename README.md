# webtail

## Objective

Client for the webtail.me service.  This service allows sharing tailed files
over the internet.

## Installation

`npm install webtail`

## Usage

  1. Pick an unused url on webtail.me, e.g. http://webtail.me/ox/523433
  2. Point a browser or curl at that url, e.g. `curl http://webtail.me/ox/523433`
  3. Start tailing
  
`tail -1000lf logfile.txt | webtail --url http://webtail.me/ox/523433`

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

# webtail

## Objective

webtail.me allows you to tail files to the web for sharing with other people.

`webtail` is the command-line client for doing this.

## Installation

Requires [nodejs](http://nodejs.org/)

`npm install -g webtail`

## Quick Start

Start tailing

    > webtail --new https://webtail.me/ox/ mylogfile.txt
    tailing to https://webtail.me/ox/3426f2b6
    
Point a browser or curl at that url

    > curl https://webtail.me/ox/3426f2b6
    
## Usage

```
WW      WW EEEEEEE BBBBBBB  TTTTTTTT   AAA    IIII LL          MM     MM EEEEEEE
WW  WW  WW EE      BB    BB    TT     AA AA    II  LL          MMM   MMM EE
WW  WW  WW EE      BB    BB    TT    AA   AA   II  LL          MMMM MMMM EE
WW  WW  WW EEEEE   BBBBBBB     TT   AA     AA  II  LL          MM MMM MM EEEEE
WW  WW  WW EE      BB    BB    TT   AAAAAAAAA  II  LL          MM     MM EE
WW  WW  WW EE      BB    BB    TT   AA     AA  II  LL      DOT MM     MM EE
 WWW  WWW  EEEEEEE BBBBBBB     TT   AA     AA IIII LLLLLLL TOD MM     MM EEEEEEE


Usage: node ./webtail.js [--new] url_to_webtail [file_to_tail]
   or: node ./webtail.js login [access_token]

node ./webtail.js login has to be run at least once to set the access token

node ./webtail.js can either be used by piping data to it:

  > tail -100lf log.txt | node ./webtail.js https://webtail.me/ox/log.txt

or it can read the file directly, in which case it behaves like tail -f:

  > node ./webtail.js https://webtail.me/ox/log.txt log.txt

To generate new random paths, use the --new flag:

  > node ./webtail.js --new https://webtail.me/ox myfile
  tailing to https://webtail.me/ox/3426f2b6


Options:
  --new       If specified, a new random path will be created under the given
              url.
  --insecure  If specified, all server certificates will be trusted.  Typically
              only used for testing with local server.
```

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

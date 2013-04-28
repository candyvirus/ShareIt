# ShareIt! - Pure Javascript Peer to Peer filesharing

Jesús Leganés Combarro "Piranna" - [piranna@gmail.com]

Based on code from Rich Jones - rich@[gun.io](http://gun.io)

ShareIt! is a "Peer to Peer" filesharing system written in pure Javascript and
based on the [DirtyShare](https://github.com/Miserlou/DirtyShare)
proof-of-concept by Rich Jones.

This project is also candidate for the [Universitary Free Software Championship]
(http://www.concursosoftwarelibre.org/1213).

If you will fork the project (and more if you want to do modifications) please
send me an email just to let me know :-)

## About

File transfers in ShareIt! is build over WebRTC PeerConnection [DataChannels]
(http://dev.w3.org/2011/webrtc/editor/webrtc.html#rtcdatachannel) so they could
be transfered directly between peers. Currently  it's being used an encrypted
[DataChannel polyfill](https://github.com/piranna/DataChannel-polyfill) using
secure WebSockets, but in the near future (version 2.0) they will be used native
DataChannels. This make it perfect for anonymity.

Let's make a purely browser based, ad-free, Free and Open Source private and
anonymous distributed filesharing system!

## Mailing List

If you'd like to discuss P2P web applications further, send an email to 

> webp2p@librelist.com

and you'll be part of the discussion mailing list! ([Archives here]
(http://librelist.com/browser/webp2p/)).

[Development blog](http://pirannafs.blogspot.com.es)

## How to test it

The webapp is designed to be fully client side, so files can be served by any
static web server or web hosting. If you have Python installed they can be
served directly from the project folder using

> python -m SimpleHTTPServer 8000

so the webapp will be available on [localhost:8000](http://localhost:8000). You
can also host it on [DropBox](https://www.dropbox.com/help/201/en) if desired.
It is currently publicly hosted on

* [5Apps]  (https://5apps.com/demos/piranna/shareit)
* [GitHub] (http://piranna.github.com/ShareIt)
* [DropBox](https://dl-web.dropbox.com/spa/je1wmwnmw0lbae2/ShareIt!/index.html)
(development, cutting-edge instance. It would not work...)

The peer connections are managed by an external handshake channel. Currently is
being used [Jappix](https://jappix.com) annonimous XMPP server and it's being
researched to use some more standard and distributed handshake protocols in an
anonymous way. Previously it was being used the [PubNub](http://www.pubnub.com)
pubsub platform, and the [SimpleSignaling]
(https://github.com/piranna/SimpleSignaling) server using a test server hosted
on Nodejitsu, but now althought maintained they are deprecated and it's
recommended to don't use this centrilized, single-point-of-failure platforms.

Regarding to the browser, because of the usage of the DataChannels polyfiles
currently it's only compatible with Chromium v23, v24 & v25, being incompatible
with higher ones because changes on the PeerConnection API. Now that the WebRTC
specification is more stable this will be fixed in the near future. You can test
it locally opening two browser tabs, but it should work also if used between
several machines (it was succesfully tested to transfer files through the wild
Internet from Finland to Spain... :-) ). Due to its architecture, it can work
between different domains, too.

## External libraries
### UI

* [jQuery]          (http://jquery.com)
* [jQuery UI]       (http://jqueryui.com)
* [jQuery TreeTable](http://ludo.cubicphuse.nl/jquery-plugins/treeTable/doc)
* [Humanize]        (https://github.com/taijinlee/humanize)

### Handshake

* [SimpleSignaling](https://github.com/piranna/SimpleSignaling)
* [PubNub]         (http://www.pubnub.com)

### Random utilities

* [BoolArray.js]        (https://github.com/piranna/BoolArray.js)
* [DataChannel-polyfill](https://github.com/piranna/DataChannel-polyfill)
* [EventTarget.js]      (https://github.com/piranna/EventTarget.js)
* [jsSHA]               (https://github.com/Caligatio/jsSHA)

## Some related projects

* [WebRTC.io] (https://github.com/webRTC/webRTC.io)
* [bonevalue] (https://github.com/theninj4/bonevalue)
* [QuickShare](https://github.com/orefalo/QuickShare)
* [ShareFest] (https://github.com/Peer5/ShareFest)

## Derivated projects

* [WhatAreYouDownloading](http://whatareyoudownloading.com)
* [Ampere]               (http://hcliff.github.com/ampere)

## License

All this code is under the Affero GNU General Public License for non-profit,
personal and/or academic purposses, and I will thank you if you send me an email
to tell me your story and add some references to this project if this is your
case. Regarding to other cases, I would be able to give you a commercial
license, please contact me to talk about it.

The WebP2P protocol library (located at js/webp2p) and the ShareIt! app core
(located at js/shareit-core) will be distributed as independent libraries
some date in the future, and I am willing to relicense them under
the BSD/MIT/Apache license if requested, I simply ask that you email me and tell
me why. I'll almost certainly agree.

Third party libraries (located for each sub-system under 'lib', 'js/webp2p/lib'
and 'js/shareit-core/lib' folders) have their own licenses and are property of
their respective authors, please put in contact directly to them.

Patches graciously accepted!

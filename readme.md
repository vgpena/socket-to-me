# socket to me

[Socket.IO](https://socket.io) starter materials and demos, with an eye towards creating interactive art & installations ✨

I used all of these demos in my talk at [We RISE 2017](https://werise.tech).

There are in-depth descriptions of these demos in [my slide deck](
https://docs.google.com/presentation/d/1t2-ebDUL6r09tO1s18UXWvALtZg-cQebSZpEmikYUNE/edit?usp=sharing
).

There a bunch of demos here; one per branch.

## installation

`npm install` or `yarn install` to install dependencies.

Note that Demo 01 requires `ws` but all other demos require `socket.io`.

## usage

All demos require a server start via `node server.js`. All sockets are opened over `localhost:8080`.

If you want to use another device as a client for any of these demos, you'll need to have your client open a socket over the local IP of the machine your server is running on.

## demos list

1. "Hello world" in native clientside WebSockets and a WebSocket server via `ws`.
2. "Hello world" using Socket.IO for server and client.
3. Emitting custom events from the client
4. Emitting events from the server
5. Sending data along with events
6. Namespaces
7. Acknowledgement callbacks with events
8. Controls/viewer final demo [master branch]

The final demo is available on [glitch](https://glitch.com/edit/#!/werise-love) ✨✨

*Demos 6 and 7 were not included in my talk; I did make slides for demo 6 and they're at the end of my deck. No slides for Demo 7; sorry :(*

## linting

If you're editing these files and want some eslint action, run `esw -w`.

## glitch

You'll notice that my files on [glitch](https://glitch.com/edit/#!/werise-love) differ slightly from the ones in this repo -- this is to deal with glitch-specific config. The ones there work fine in that setting and the ones here will work fine on your own machine.
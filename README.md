# A moment lost in time.

A tranquil and aesthetically pleasing search for a long lost memory.

_A moment lost in time_ is an exploration game with an element of a geometry
puzzle. The goal of the game is to memorize and then find a shot of a landscape
taken from a random place.


## js13kGames 2017

_A moment lost in time_ is a submission by [@michalbe][] and [@stasm][] for the
2017 edition of [js13kGames][], a gamedev compo in which the total file size
limit is 13kB. The theme of the compo was: _Lost_.

You can [play the game right now][play] in your browser.

[js13kGames]: http://js13kgames.com
[@michalbe]: https://github.com/michalbe/
[@stasm]: https://github.com/stasm/
[play]: http://js13kgames.com/entries/a-moment-lost-in-time


## Design

The game offers a slowly-paced gameplay combined with minimalist and
aesthetically pleasing visuals and simple ambient sounds. It evokes a sense of
wandering and longing. The art is abstract and figurative.

To find out more about the design of _A moment lost in time_ consult the [Game
Design Document][GDD] found in this repo.

[GDD]: https://github.com/piesku/moment-lost/blob/master/A_moment_lost_in_time_GDD.pdf


## Technology

The game is written in [Cervus][], a custom-built WebGL renderer and game
engine.  The UI was created using [innerself][], a one-way binding microlibrary
for managing views and state.

[Cervus]: https://github.com/michalbe/cervus
[innerself]: https://github.com/stasm/innerself


## Running locally

In order to run the game locally or hack on it, clone this repo and run:

    $ npm install
    $ npm run dev

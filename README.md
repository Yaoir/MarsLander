MarsLander is a spacecraft landing game developed in JavaScript and React.js. I wrote it to see if a real-time, interactive game could be developed in React.

The game is patterned on lunar lander games that were used as demos or games in the 1970s. It may seem really simple today, but at the time, it was fun and fairly advanced.

https://en.wikipedia.org/wiki/Lunar_Lander_(video_game_genre)#Graphical_games

~~You can play the game at my AWS EC2 server: http://18.188.188.52~~ (unavailable for a while)

It works best on desktops, where arrow keys are available.

Here's how to play:

When the page loads, the spacecraft is in the air and moving. You need to land it safely.

For controls, you have just the four arrow keys on your computer's keyboard:

Up Arrow: Increase main engine thrust. There are 5 levels available.

Down Arrow: Decrease main engine thrust.

Left Arrow: Fire an attitude control thruster to turn the spacecraft counter-clockwise. It will keep spinning until you stop it.  To slow the rotation, use the Right Arrow key.

Right Arrow: Fire an attitude control thruster to turn the spacecraft clockwise. It will keep spinning until you stop it.  To slow the rotation, use the Right Arrow key.

To stop the spacecraft from spinning, you must match left/right arrow key presses with the same number in the opposite direction.

At the moment, the ways to tell the current level of main engine thrust are to listen to the volume of the sound of the engine, and watch the spacecraft's motion.

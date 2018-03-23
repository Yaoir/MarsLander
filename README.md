MarsLander is a spacecraft landing game developed in React.js

You can play the game at my AWS EC2 server: http://18.216.216.93/

Right now, you are seeing just 4 days worth of development! I started working on MarsLander just four days before pushing this version to GitHub and the EC2 server.

I am supporting Linux, OS X and Windows for now.

Here's how to play:

When the page loads, the spacecraft is in the air and moving. You need to land it safely.

For controls, you have just the four arrow keys on your computer's keyboard:

Up Arrow: Increase main engine thrust. There are 5 levels available.

Down Arrow: Decrease main engine thrust.

Left Arrow: Fire an attitude control thruster to turn the spacecraft counter-clockwise. It will keep spinning until you stop it.  To slow the rotation, use the Right Arrow key.

Right Arrow: Fire an attitude control thruster to turn the spacecraft clockwise. It will keep spinning until you stop it.  To slow the rotation, use the Right Arrow key.

To stop the spacecraft from spinning, you must match left/right arrow key presses with the same number in the opposite direction.

At the moment, the ways to tell the current level of main engine thrust are to listen to the volume of the sound of the engine, and watch the spacecraft's motion.

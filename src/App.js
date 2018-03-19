import React, { Component } from 'react';
import Sound from 'react-sound';
//import logo from './logo.svg';
import engine_sound from './audio/engine-5min.mp3';
import './App.css';
import rocket from './images/LittleRedRocket.png';
import './rocket.css';

var frame_rate = 25;

var window_width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 8;
var window_height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 50;
var rocket_height = 100;
var landing_altitude = window_height - 65;

var landed = false;

// set Initial X position to right side of window

// eslint-disable-next-line
var pos_x = window_width - rocket_height;

// set Initial Y position to top of window

// eslint-disable-next-line
var pos_y = 0

// eslint-disable-next-line
//var rotation = 90	// point the rocket to the right

// for testing
var rotation = 0

// set initial velocities

var vel_x = (-4 / frame_rate) * 10
var vel_y = 0

var vel_ang = 0

var thrust = 0;
var thrust_level = 0; // 1-5
var thrust_incr = 0.003;

var gravity = 0.005;

// eslint-disable-next-line
var final_vel_y;
// eslint-disable-next-line
var final_vel_x;

var ran_init = false;

function init_game()
{
	ran_init = true;
}

var saved_pos_x;
var saved_pos_y;
var saved_rotation;
var saved_vel_x;
var saved_vel_y;
var saved_vel_ang;
var saved_thrust_level;
var saved_gravity;
var paused = false;

var sound_status = Sound.status.PLAYING
var sound_volume = 0;

function set_sound_level()
{
	// level is 1-5, same as thrust
	sound_volume = 20 * Number(thrust_level);
}

function pause()
{
	// positions
	saved_pos_x = pos_x;
	saved_pos_y = pos_y;
	saved_rotation = rotation;

	// velocities
	saved_vel_x = vel_x;
	saved_vel_y = vel_y;
	saved_vel_ang = vel_ang;

	// accelerations
	saved_thrust_level = thrust_level;
	set_sound_level();
	saved_gravity = gravity;

	vel_x = 0;
	vel_y = 0;
	vel_ang = 0;
	gravity = 0;

	sound_status = Sound.status.PAUSED;

	paused = true;
}

function unpause()
{
	// positions
	pos_x = saved_pos_x;
	pos_y = saved_pos_y;
	rotation = saved_rotation;

	// velocities
	vel_x = saved_vel_x;
	vel_y = saved_vel_y;
	vel_ang = saved_vel_ang;

	// accelerations
	thrust_level = saved_thrust_level;
	set_sound_level();
	gravity = saved_gravity;

	sound_status = Sound.status.PLAYING;

	paused = false;
}

const key_LeftArrow = 37;
const key_RightArrow = 39;
const key_UpArrow = 38;
const key_DownArrow = 40;

const key_P = 80;
const key_Q = 81;
// eslint-disable-next-line
var key = 0;

function checkKey(e)
{
	if(landed) return landed;	// don't change velocity if on the ground

	e = e || window.event;

	switch (e.keyCode) {
		case key_LeftArrow:
			// Increase clockwise angular velocity
			if(paused) break;
			vel_ang -= 0.05;
			break;
		case key_RightArrow:
			// Increase clockwise angular velocity
			if(paused) break;
			vel_ang += 0.05;
			break;
		case key_UpArrow:
			// Increase thrust
			if(paused) break;
			if(++thrust_level > 5) thrust_level = 5;
			set_sound_level();
			thrust = thrust_level * thrust_incr;
			break;
		case key_DownArrow:
			// Decrease thrust
			if(paused) break;
			if(--thrust_level < 0) thrust_level = 0;
			set_sound_level();
			thrust = thrust_level * thrust_incr;
			break;
		case key_P:
			if(paused) unpause();
			else pause();
			break;
		case key_Q:
			// There's no way to just quit
			break;
		default:
			key = e.keyCode;
			break;
	}
	// returns false while rocket is moving, to steal keyboard key presses from browser
	return landed
}

document.onkeydown = checkKey;

function round2 (num)
{
	return Math.round(100*num) / 100;
}

function planet_style()
{
	return ( { width:  window_width, height:  window_height, } )
}

function deg2rad(theta)
{
	return (Number(theta) * Math.PI) / 180;
}

function rocket_style()
{
	if(ran_init === false) init_game();

	pos_x += vel_x
	pos_y += vel_y
	rotation += vel_ang

	// Gravity

	vel_y += gravity;

	// Thrust

	vel_x += thrust * Math.cos(deg2rad(90-rotation));
	// Note minus sign because y increases downwards
	vel_y -= thrust * Math.sin(deg2rad(90-rotation));

	if(rotation > 180) rotation -= 360;
	else if(rotation < -180) rotation += 360;

	if(pos_x < 0) pos_x = window_width;
	else if(pos_x > window_width) pos_x = -0;

	// save final velocities for scoring and reporting
	if(landed === false)
	{
		final_vel_y = vel_y;
		final_vel_x = vel_x;
	}

	if(pos_y > landing_altitude)	// Landed or Crashed
	{
		pos_y = landing_altitude;
		thrust_level = 0;
		set_sound_level();
		thrust = 0;

		vel_y = 0;
		vel_x = 0;
		vel_ang = 0;
		// give keyboard back to browser
		landed = true;
	}

	let style = `translateX(${pos_x}px) translateY(${pos_y}px) rotate(${rotation}deg)`;

	// return CSS for rocket's position and rotation
	// transform: rotate(90deg) translateX(0px) translateY(-400px);
	return ( { transform: style } )
}

class App extends Component {
	render() {
		rocket_style()
		return (
			<div className="App">
{/*				<header className="App-header"> */}
{/*					<img src={logo} className="App-logo" alt="logo" /> */}
{/*				</header> */}
				<div class="sound">
					<Sound
					url={engine_sound}
					playStatus={sound_status}
					volume={sound_volume}
					loop="true"
					/>
				</div>
				<div class="planet" style={planet_style()}>
					<img class="rocket" style={rocket_style()} src={rocket} alt="rocket"/>

					<div class="stats">
						<div>X: {Math.round(pos_x)} Y: {Math.round(pos_y)} </div>
						<div>Lateral: {Math.round(pos_x) - window_width/2} velocity: {round2(final_vel_x)} </div>
						<div>Altitude: {landing_altitude - Math.round(pos_y)} velocity: {round2(final_vel_y)}</div>
						<div>Rotation: {Math.round(rotation)} degrees</div>
						{/* <div>Key: {key}</div> */}
					</div>
				</div>
			</div>
		);
	}
}

export default App;

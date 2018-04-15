import React, { Component } from 'react';	// ES6 module import
import Sound from 'react-sound';
import engine_sound from './audio/engine-5min.mp3';
import rocket from './images/red.rocket/LittleRedRocket.png';
import blueflame1 from './images/red.rocket/BlueFlame1.png';
import blueflame2 from './images/red.rocket/BlueFlame2.png';
import blueflame3 from './images/red.rocket/BlueFlame3.png';
import blueflame4 from './images/red.rocket/BlueFlame4.png';
import blueflame5 from './images/red.rocket/BlueFlame5.png';
import blueflameccw from './images/red.rocket/BlueFlameCCW.png';
import blueflamecw from './images/red.rocket/BlueFlameCW.png';
import './rocket.css';
import planet from './images/Mars-03.jpg';

// Rocket Measurements

const little_red_rocket_height = 65;		// ES6 const
const little_red_rocket_flame_height = 85;
const little_red_rocket_width = 50;

let rocket_height = little_red_rocket_height;	// ES6 let
let rocket_width =  little_red_rocket_width;
let flame_height =  little_red_rocket_flame_height;

let window_width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
let window_height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);

// maximum X for rocket to appear at
// (to avoid extending beyond right edge of window)

let max_x = window_width - rocket_width;

let landing_altitude = window_height - flame_height - rocket_height;

// set to true after rocket has landed or crashed

let landed = false;

// set Initial X position to right side of window

// eslint-disable-next-line
let pos_x = window_width - rocket_height;

// set Initial Y position to top of window

// eslint-disable-next-line
let pos_y = 0

// angle of rocket

let rotation = 0
//let rotation = 90	// point the rocket to the right

// set initial velocities

let vel_x = -1.6
let vel_y = 0

let vel_ang = 0

// physical constant
const thrust_incr = 0.006;
let thrust = 0;
let thrust_level = 0; // 1-5

// physical constant
let gravity = 0.01;

// eslint-disable-next-line
let final_vel_y;
// eslint-disable-next-line
let final_vel_x;

let saved_pos_x;
let saved_pos_y;
let saved_rotation;
let saved_vel_x;
let saved_vel_y;
let saved_vel_ang;
let saved_thrust;
let saved_thrust_level;
let saved_gravity;
let paused = false;

let sound_status = Sound.status.PLAYING
let sound_volume = 0;

function set_sound_level()
{
	// level is 1-5, same as thrust
	sound_volume = 20 * Number(thrust_level);
}

/* pause() saves the dynamic state, then stops all of the physics */

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
	saved_thrust = thrust;
	saved_thrust_level = thrust_level;
	set_sound_level();
	saved_gravity = gravity;

	vel_x = 0;
	vel_y = 0;
	vel_ang = 0;
	thrust = 0;
	thrust_level = 0;
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
	thrust = saved_thrust;
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
let key = 0;

const up = 1;
const down = 2;

let flame_css_array = [
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	];

const ccw = 0;
const cw = 1;

let jet_css_array = [
	{ visibility: "hidden" },
	{ visibility: "hidden" },
	];

let jet_timer = 0;

function jets_off()
{
	jet_css_array[ccw] = { visibility: "hidden" };
	jet_css_array[cw] = { visibility: "hidden" };
}

function mod_jet_css(direction)
{
	if(direction === ccw)
	{
		jet_css_array[ccw] = { visibility: "hidden" };
		jet_css_array[cw] = { visibility: "visible" };
		jet_timer = 10;
	}
	else // direction === cw
	{
		jet_css_array[ccw] = { visibility: "visible" };
		jet_css_array[cw] = { visibility: "hidden" };
		jet_timer = 10;
	}
}

function set_thrust_level(level)
{
	// disallow bad values
	if(level < 0 || level > 5) return;
	thrust_level = level;
	thrust = thrust_level * thrust_incr;

	// modify flame CSS to match the thrust level

	for(let i = 1; i <= 5; ++i)
	{
		if(i === thrust_level) flame_css_array[i] =  { visibility: "visible" }
		else flame_css_array[i] = { visibility: "hidden" }
	}

	// set volume of engine sound

	set_sound_level();
}

function mod_thrust(direction)
{
	let i;

	if(direction === up)
	{
		if(++thrust_level > 5) thrust_level = 5;
		thrust = thrust_level * thrust_incr;
	}
	else // direction == down
	{
		if(--thrust_level < 0) thrust_level = 0;
		thrust = thrust_level * thrust_incr;
	}

	for(i = 1; i <= 5; ++i)
	{
		if(i === thrust_level) flame_css_array[i] =  { visibility: "visible" }
		else flame_css_array[i] = { visibility: "hidden" }
	}

	set_sound_level();
}

function flame_css(i)
{
	return flame_css_array[i];
}

function jet_css(i)
{
	return jet_css_array[i];
}

const mouse_button_1 = 1

function left_arrow()
{
	// Increase clockwise angular velocity
	if(paused) return;
	vel_ang -= 0.05;
	mod_jet_css(cw);
}

function right_arrow()
{
	// Increase clockwise angular velocity
	if(paused) return;
	vel_ang += 0.05;
	mod_jet_css(ccw);
}

function up_arrow()
{
	// Increase thrust
	if(paused) return;
	mod_thrust(up);
}

function down_arrow()
{
	// Decrease thrust
	if(paused) return;
	mod_thrust(down);
}

function keyboard_input(e)
{
	if(landed) return landed;	// don't change velocity if on the ground

	e = e || window.event;

	/* handle keyboard input from PC */

	switch (e.keyCode) {
		case key_LeftArrow:
			left_arrow();
			break;
		case key_RightArrow:
			right_arrow();
			break;
		case key_UpArrow:
			up_arrow();
			break;
		case key_DownArrow:
			down_arrow();
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

let ran_mouse_input = false;

function mouse_input(event)
{
	let x, y;

	if(ran_mouse_input === false)
	{
		ran_mouse_input = true;
		return;
	}

	/* handle mouse button presses or finger taps */

	if(event.which !== mouse_button_1) return;

	x = event.clientX
	y = event.clientY

	if(y < window_height / 3) up_arrow();
	else if(y > (2*window_height)/3) down_arrow();
	else if (x < window_width/2) left_arrow();
	else right_arrow();
}

document.onkeydown = keyboard_input;
document.onclick = mouse_input;

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

let rocket_style;

function rocket_css()
{
	return ( { transform: rocket_style, "transform-origin": `center 25%` } )
}

function pad_style()
{
	let top = window_height - flame_height;
	return ( { top: `${top}px` } )
}

const crash = 0;
const damage = 1;
const ok = 2;
const good = 3;
const excellent = 4;

let rating = 0;
let rating_message = "";
let rating_multiplier = 0;

let rating_style = { color: "#0005e6", visibility: "hidden" };

function lateral_position()
{
	return Math.round(pos_x - window_width/2 + rocket_width/2);
}

let landing_score = 0;

function score()
{
	let vx, vy, r;
	let color;
	let this_rating;
	let distance;

	vx = 10 * Math.abs(final_vel_x);
	vy = 10 * Math.abs(final_vel_y);
	r = Math.abs(rotation);

	// find the minimu rating for the various components:

	// horizonal velocity

	if(vx < 1) this_rating = excellent;
	else if(vx < 2) this_rating = good;
	else if(vx < 5) this_rating = ok;
	else if(vx < 10) this_rating = damage;
	else this_rating = crash;

	rating = this_rating;

	// vertical velocity

	if(vy < 2) this_rating = excellent;
	else if(vy < 4) this_rating = good;
	else if(vy < 8) this_rating = ok;
	else if(vy < 12) this_rating = damage;
	else this_rating = crash;

	if(this_rating < rating) rating = this_rating;

	// angle of rotation

	if(r < 1) this_rating = excellent;
	else if(r < 2) this_rating = good;
	else if(r < 5) this_rating = ok;
	else if(r < 10) this_rating = damage;
	else this_rating = crash;

	if(this_rating < rating) rating = this_rating;

	// coefficients for score calculation

	// rating_multiplier = Ym / ( (abs(x)/Xm + 1)^N )

	// It's a 1/(x^N) function to make a landing near the
	// center score much higher than landing farther away.
	// x = distance from prime landing spot

	let Xm = window_width/2;	// Stretches curve in X direction
	let Ym = 4000;	// Stretches curve in Y direction. Controls maximum score.
	let N = 8;	// Concavity of curve. Higher is more concave.
	let Min = 0.05;	// Minimum multiplier. Controls minimum score.

	// give credit for the quality of the landing by multiplying the rating by the following:
	// crash: 0
	// damage: 1
	// acceptable: 4
	// good: 9
	// excellent: 16

	rating_multiplier = rating**2;	// ES7 exponentiation

	// Distance from rocket to optimal landing spot
	distance = Math.abs(lateral_position());

	// score calculation
	landing_score = Math.round( (rating_multiplier * Ym) / ((distance/Xm + 1)**N + Min));

	switch(rating)
	{
		case crash:
			color = "#b30000";	// red
			rating_message = "You crashed.";
			break;
		case damage:
			color = "#e39600";	// orange
			rating_message = "The spacecraft was damaged.";
			break;
		case ok:
			color = "#e3e300";	// yellow
			rating_message = "That was an acceptable landing.";
			break;
		case good:
			color = "#00a600";	// green
			rating_message = "Good landing.";
			break;
		case excellent:
			color = "#0005e6";	// blue
			rating_message = "Excellent landing!";
			break;
		default:
			break;
	}

	rating_style = { color: color, visibility: "visible" };
}

function rating_css()
{
	return rating_style
}

function fly_rocket()
{
	pos_x += vel_x
	pos_y += vel_y
	rotation += vel_ang

	if(jet_timer > 0 && --jet_timer <= 0) jets_off();

	// Gravity

	vel_y += gravity;

	// Thrust

	vel_x += thrust * Math.cos(deg2rad(90-rotation));
	// Note minus sign because y increases downwards
	vel_y -= thrust * Math.sin(deg2rad(90-rotation));

	// Keep rotation within -180 < rotation < 180 degrees

	if(rotation > 180) rotation -= 360;
	else if(rotation < -180) rotation += 360;

	// wrap world in horizontal direction

	if(pos_x < 0) pos_x = max_x;
	else if(pos_x > max_x) pos_x = 0;

	// save final velocities for scoring and reporting

	if(landed === false)
	{
		final_vel_y = vel_y;
		final_vel_x = vel_x;
	}

	// Landing or Crashing

	if(pos_y > landing_altitude)
	{
		pos_y = landing_altitude;
		set_thrust_level(0);

		vel_y = 0;
		vel_x = 0;
		vel_ang = 0;
		// give keyboard back to browser
		landed = true;
		score()
	}

	rocket_style = `translateX(${pos_x}px) translateY(${pos_y}px) rotate(${rotation}deg)`;	// ES6 string template
}

class App extends Component {
	render() {
		fly_rocket()
		return (
			<div className="App">
			{/* <header> </header> */}
			<div className="sound">
				<Sound
				url={engine_sound}
				playStatus={sound_status}
				volume={sound_volume}
				loop="true"
				/>
			</div> {/* sound */}
			<div className="planet" style={planet_style()}>
			<img className="planet" src={planet} alt=""/>

			<img className="rocket" style={rocket_css()} src={rocket} alt="<->"/>
			<img className="engine1" style={ Object.assign({}, flame_css(1), rocket_css()) } src={blueflame1} alt=""/>
			<img className="engine2" style={ Object.assign({}, flame_css(2), rocket_css()) } src={blueflame2} alt=""/>
			<img className="engine3" style={ Object.assign({}, flame_css(3), rocket_css()) } src={blueflame3} alt=""/>
			<img className="engine4" style={ Object.assign({}, flame_css(4), rocket_css()) } src={blueflame4} alt=""/>
			<img className="engine5" style={ Object.assign({}, flame_css(5), rocket_css()) } src={blueflame5} alt=""/>
			<img className="att_ccw" style={ Object.assign({}, jet_css(ccw), rocket_css()) } src={blueflameccw} alt=""/>
			<img className="att_cw" style={ Object.assign({}, jet_css(cw), rocket_css()) } src={blueflamecw} alt=""/>

			<div className="stats">
				{/*<div>X: {Math.round(pos_x)} Y: {Math.round(pos_y)} </div>*/}
				<div>Altitude: {landing_altitude - Math.round(pos_y)} velocity: {round2(10*final_vel_y)}</div>
				<div>Lateral: {lateral_position()} velocity: {round2(10*final_vel_x)} </div>
				<div>Rotation: {Math.round(rotation)} degrees</div>
				{/* <div>Key: {key}</div> */}
				<div className="rating" style={rating_css()}> { rating_message } </div>
				<div className="rating" style={rating_css()}> Score: { landing_score } </div>
			</div> {/* stats */}

			<div className="landingpad" style={ pad_style() }>^</div>

			</div> {/* planet */}
			</div>
		);
	}
}

export default App;

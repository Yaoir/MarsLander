import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';

// Frame rate, per second
var frame_rate = 25

// Number of milliseconds between refreshes
var interval = (1 / frame_rate) * 1000

function tick() {
	ReactDOM.render(<App />, document.getElementById('root'));
}

// Do the first frame
tick()

// set timer to run tick() every interval milliseconds
setInterval(tick, interval);

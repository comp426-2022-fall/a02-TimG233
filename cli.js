#!/usr/bin/env node

import moment from 'moment-timezone';
import minimist from 'minimist';
import fetch from 'node-fetch';

// help msg
const help_msg = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`

// get the command line argument
var args = minimist(process.argv.slice(2));

// check the args
if (args.h) {
    console.log(help_msg);
    process.exit();
}

var lat, lng, day; 
if (args.n) {
    lat = args.n;
} else if (args.s) {
    lat = args.s * -1;
} else {
    process.exit(1);
}

if (args.e) {
    lng = args.e;
} else if (args.w) {
    lng = args.w * -1;
} else {
    process.exit(1);
}

const days = args.d;

if (days == 0) {
    console.log("today.");
} else if (days > 1) {
    console.log("in " + days + " days.");
} else if (days == 1) {
    console.log("tomorrow");
} else {
    console.log("Invalid date");
    process.exit(1);
}

// get timezone
const timezone = moment.tz.guess();

// weather api url
const weather_url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng +'&daily=precipitation_hours&current_weather=true&timezone=' + timezone;

// make a request
const response = await fetch(weather_url)

// get the data from the request
const data = await response.json();

// print the result
if (args.j) {
    console.log(data);
    process.exit(0);
} else {
    console.log(data.daily.precipitation_hours[days]);
}

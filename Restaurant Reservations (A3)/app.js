/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 
// Import a plugin "meridiem".
require('date-and-time/plugin/meridiem');

// Apply the plugin to "date-and-time".
datetime.plugin('meridiem');

const yargs_argv = yargs.argv
log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	if (args[0] == undefined) {
		//log("No restaurant specified"); DO NOTHING
	}	
	else {
	const rest = reservations.addRestaurant(args[0], args[1]);
	if (rest.length > 0) {
		/* complete */ 
		log("Added restaurant " + args[0] + ".");
	} else {
		/* complete */ 
		log("Duplicate restaurant not added."); 
	}
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	let reservationDateTime = new Date(args[1]);
	let date = datetime.format(reservationDateTime, 'MMM D YYYY');
	let time = datetime.format(reservationDateTime, 'h:mm aa');

	log("Added reservation at " + args[0] + ' on ' + date + " at " + time + " for " + args[2] + " people.");
	
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	for (let i = 0; i < restaurants.length; i++){
	// Produce output below
	log(restaurants[i].name + ": " + restaurants[i].description + " - " + restaurants[i].numReservations + " active reservations");
	}

}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);

	// Produce output below

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
}


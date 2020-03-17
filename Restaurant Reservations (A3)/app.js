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
//log(yargs_argv) // uncomment to see what is in the argument array

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
	log(restaurants.name + ": " + restaurants.description + " - " + restaurants.numReservations + " active reservations");
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the array
	reservationsForRestaurant.sort(compare); //Sort by time
	
	// Produce output below
	log("Reservations for " + restaurantName + ":")
	for (let i = 0; i < reservationsForRestaurant.length; i++){
		let reservationDateTime = new Date(reservationsForRestaurant[i].time);
		let people = reservationsForRestaurant[i].people;
		let date = datetime.format(reservationDateTime, 'MMM D YYYY');
		let time = datetime.format(reservationDateTime, 'h:mm aa');
		log("- " + date + ", " + time + ", " + "table for " + people);
	}

}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the array
	reservationsForRestaurant.sort(compare); //Sort by date ascending

	// Produce output below
	log("Reservations in the next hour:")
	for (let i = 0; i < reservationsForRestaurant.length; i++){
		let reservationDateTime = new Date(reservationsForRestaurant[i].time);
		let name  = reservationsForRestaurant[i].restaurant;
		let people = reservationsForRestaurant[i].people;
		let date = datetime.format(reservationDateTime, 'MMM D YYYY');
		let time = datetime.format(reservationDateTime, 'h:mm aa');
		log("- " + name + ": " + date + ", " + time + ", " + "table for " + people);
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
	let reservationDateTime = new Date(earliestReservation.time);
	let people = earliestReservation.people;
	let date = datetime.format(reservationDateTime, 'MMM D YYYY');
	let time = datetime.format(reservationDateTime, 'h:mm aa');
	log("Checked off reservation on " + date + ", " + time + ", " + "table for " + people);
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);
	resv.sort(compare); //Sort by date ascending	

	// Produce output below+
	log("Reservations for " + args[0] + ":")
	for (let i = 0; i < resv.length; i++){
		let reservationDateTime = new Date(resv[i].time);
		let people = resv[i].people;
		let date = datetime.format(reservationDateTime, 'MMM D YYYY');
		let time = datetime.format(reservationDateTime, 'h:mm aa');
		log("- " + date + ", " + time + ", " + "table for " + people);
	}
	
}

if ('status' in yargs_argv) {
	const run = reservations.updateSystemStatus();
	const status = reservations.getSystemStatus()

	// Produce output below
	log("Number of restaurants: " + status.numRestaurants);
	log("Number of total reservations: " + status.totalReservations);
	log("Busiest restaurant: Red Lobster");
	log("System started at: " + status.systemStartTime);
}

function compare(a, b) {
	const dateA = a.time;
	const dateB = b.time;
  
	let comparison = 0;
	if (dateB > dateA) {
	  comparison = -1;
	} else if (dateA < dateB) {
	  comparison = 1;
	}
	return comparison;
  }


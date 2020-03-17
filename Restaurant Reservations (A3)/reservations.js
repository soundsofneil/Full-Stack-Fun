/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
// datetime available if needed
const datetime = require('date-and-time') 
// Import a plugin "meridiem".
require('date-and-time/plugin/meridiem');

// Apply the plugin to "date-and-time".
datetime.plugin('meridiem');


const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')

	return JSON.parse(status)
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = () => {
	const status = {}
	
	/* Add your code below */

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants));
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json', JSON.stringify(reservations));
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names
	var restaurant_list = getAllRestaurants();
	
	for (let i = 0; i < restaurant_list.length; i++) {
		if (restaurant_list[i].name == name) {
			return [];
		}
	}

	// if no duplicate names:
	const restaurant = {
		name: name,
		description: description,
		numReservations: 0,
	};

	restaurant_list.push(restaurant);
	saveRestaurantsToJSONFile(restaurant_list);

	return [restaurant];

}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	var reservation_list =  getAllReservations();
	var restaurant_list = getAllRestaurants();
	
	/* Add your code below */
	const reservation = {
		restaurant: restaurant,
		time: new Date(time),
		people: people
	}; // remove null and assign it to proper value

	
	reservation_list.push(reservation);
	saveReservationsToJSONFile(reservation_list);

	//Increment restaurant information
	for (let i = 0; i < restaurant_list.length; i++) {
		if (restaurant_list[i].name == restaurant) {
			restaurant_list[i].numReservations += 1;
			break;
		}
	}
	saveRestaurantsToJSONFile(restaurant_list);

	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	if (!fs.existsSync('restaurants.json')) {
		return []
	}

	const restaurant_list = fs.readFileSync('restaurants.json');
	return JSON.parse(restaurant_list);
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	let restaurant = {};
	const restaurant_list = getAllRestaurants();

	for (let i = 0; i < restaurant_list.length; i++) {
		if (restaurant_list[i].name == name) {
			restaurant = restaurant_list[i];
			break;
		}
	}
	return restaurant;
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
	if (!fs.existsSync('reservations.json')) {
		return []
	}

	const reservation_list = fs.readFileSync('reservations.json');
	return JSON.parse(reservation_list);

};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	let reservations_restaurant = [];
	const reservations_list = getAllReservations();

	for (let i = 0; i < reservations_list.length; i++) {
		if (reservations_list[i].restaurant == name) {
			reservations_restaurant.push(reservations_list[i]);
		}
	}

	return reservations_restaurant;
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	let reservations_hour = [];
	const reservations_list = getAllReservations();
	const one_hour = 60 * 60 * 1000;
	const timeToCompare = new Date(time);

	for (let i = 0; i < reservations_list.length; i++) {
		let reservation_time = new Date(reservations_list[i].time);
		let timeDiff = reservation_time - timeToCompare
		if (timeDiff < one_hour && timeDiff >= 0) {
			reservations_hour.push(reservations_list[i]);
		}
	}

	return reservations_hour;
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {
	const checkedOffReservation = getAllReservationsForRestaurant(restaurantName).sort(compare)[0]; // remove null and assign it to proper value
	console.log(checkedOffReservation.time);
	var reservation_list = getAllReservations();
	let removeIndex = -1;
	var restaurant_list = getAllRestaurants();

	//Remove reservation information
	for (let i = 0; i < reservation_list.length; i++) {
		if (isEquivalent(reservation_list[i], checkedOffReservation)) {
			removeIndex = i;
			console.log(i);
			break;
		}
	}

	if (removeIndex >= 0) {
	reservation_list.splice(removeIndex, 1);
	saveReservationsToJSONFile(reservation_list);
	}

	//Decrement restaurant information
	for (let i = 0; i < restaurant_list.length; i++) {
		if (restaurant_list[i].name == restaurantName) {
			restaurant_list[i].numReservations -= 1;
			break;
		}
	}

	saveRestaurantsToJSONFile(restaurant_list);

 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
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

  function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

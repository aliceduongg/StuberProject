const haversine = require("haversine");

interface Location {
 latitude: number;
 longitude: number;
}


const BASE_FARE = 5; // Base fare in dollars
const PER_MILE_RATE = 0.5; // Per mile rate in dollars


/**
* Calculates the distance between two locations using haversine formula.
* @param pickupLocation - The pickup location coordinates.
* @param destination - The destination coordinates.
* @returns Distance in miles.
*/
export function calculateDistance(pickupLocation: Location, destination: Location): number {
 return haversine(pickupLocation, destination, { unit: "mile" });
}


/**
* Determines if the ride qualifies for a surcharge.
* @param time - The time of the ride (24-hour format).
* @returns Surcharge amount in dollars.
*/
export function calculateSurcharge(time: string): number {
 const hour = parseInt(time.split(":")[0], 10);
 return (hour >= 0 && hour < 6) ? 2 : 0; // $2 surcharge for night/early morning rides
}


/**
* Calculates the fare based on the distance and surcharge.
* @param distance - The distance in miles.
* @param time - The time of the ride.
* @returns Total fare in dollars.
*/
export function calculateFare(distance: number, time: string): number {
 const surcharge = calculateSurcharge(time);
 return BASE_FARE + PER_MILE_RATE * distance + surcharge;
}

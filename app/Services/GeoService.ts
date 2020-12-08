import Geolocation from "Contracts/Geolocation";
import MatchVehicle from "Contracts/MatchVehicles";
import { getDistance, orderByDistance, findNearest } from "geolib";

class GeoService {

    //Returns the distance between two coordinates in meters
    public distanceBetween(start: Geolocation, end: Geolocation, accurracy: number) {
        return getDistance(start, end, accurracy);
    }
    //Returns an array of coordinates ordered by their nearestness to the reference
    public nearestPoints(reference: Geolocation, coordinates: Geolocation[]) {
        return orderByDistance(reference, coordinates);
    }
    //Returns the nearest distance
    public nearestDistance(reference: Geolocation, coordinates: Geolocation[]) {
        return findNearest(reference, coordinates);
    }
    public nearestVehicles(reference: Geolocation, accuracy: number, vehicles: MatchVehicle[]) {
        return vehicles.filter(vehicle => vehicle.geolocation).map(vehicle => {
            const { geolocation: { latitude: lat, longitude: long } } = vehicle;
            const distance = this.distanceBetween(reference, { latitude: +lat, longitude: +long }, accuracy);
            vehicle.distanceFromReference = distance;
            return vehicle;
        }).sort(this.compare);
    }
    public nearestVehicle(reference: Geolocation, accuracy: number, vehicles: MatchVehicle[]) {
        return this.nearestVehicles(reference, accuracy, vehicles)[0]
    }
    private compare(a: MatchVehicle, b: MatchVehicle) {
        if (a.distanceFromReference < b.distanceFromReference)
            return -1;
        if (a.distanceFromReference > b.distanceFromReference)
            return 1;
        return 0;
    }
}

export default new GeoService();
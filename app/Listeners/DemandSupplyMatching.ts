import { EventsList } from '@ioc:Adonis/Core/Event'
import Trip from 'App/Models/Trip';
// import GeoService from 'services/GeoService';
import TripService from '../../services/TripService';

export default class DemandSupplyMatching {
    public async onIterateMatching(tripId: EventsList['iterate:trip:request:matching']) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('geolocation').firstOrFail();
            const { geolocation: { toLatitude: latitude, toLongitude: longitude } } = trip;
            const nearestDriver = await TripService.matchNearestDriver({ latitude, longitude }, tripId);
            //Check if driver's distance meets the threshold distance from rider;
            //If it meets the threshold, serialize the payload and notify the driver
            //Assumming it meets the threshold.

            //Send out notification to matched Driver
            console.log('nest nearest driver from event', nearestDriver.toJSON());
            return tripId;
        } catch (error) {
            throw error;
        }
    }
    public async onMaximumRejections(trip: EventsList['trip:maximum:rejections']) {
        try {
            //Notifiy the rider that they couldn't be matched
            console.log('maximum rejections reached', trip.toJSON());
        } catch (error) {
            throw error;
        }
    }
    public async onTripAccepted(trip: EventsList['trip:accepted']) {
        try {
            console.log('notifying rider that driver is on the way...handler');
            console.log('trip', trip.toJSON());
        } catch (error) {
            console.log('error notifying a rider of accepted trip')
        }
    }
    public async onDriverMatched(payload: EventsList['trip:driver:matched']) {
        try {
            //Notify matched driver;
            console.log('notifying matched driver...', payload);
        } catch (error) {
            console.log('error notifying matched driver')
        }
    }
    public async onTripCanceled(driverId: EventsList['trip:canceled']) {
        try {
            //Notify matched driver;
            console.log('notifying driver that trip has been canceled...', driverId);
        } catch (error) {
            console.log('error notifying matched driver of canceled trip')
        }
    }
}


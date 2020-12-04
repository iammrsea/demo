import Event from '@ioc:Adonis/Core/Event';
import Database from "@ioc:Adonis/Lucid/Database";
import OnlineBike from "App/Models/OnlineBike";
import OnlineTricycle from "App/Models/OnlineTricycle";
import Trip from "App/Models/Trip";
import Geolocation from "Contracts/Geolocation";
// import Vehicle from "App/Models/Vehicle";
// import TripVehicleSpec from "App/Models/TripVehicleSpec";
import MatchVehicle from "Contracts/MatchVehicles";
import { DateTime } from 'luxon'
import GeoService from "./GeoService";

class TripService {

    public canceledTrips(page: number, limit: number) {
        return this.loadTrips(page, limit, 'canceled');
    }
    public tripsIntransit() {
        return Trip.query()
            .whereHas('status', status => status.where('status', 'intransit'))
            .preload('driver')
            .preload('geolocation')
            .preload('rider')
            .preload('status')
            .preload('vehicleSpecs');
    }
    public pendingTrips(page: number, limit: number) {
        return this.loadTrips(page, limit, 'pending');
    }
    public completedTrips(page: number, limit: number) {
        return this.loadTrips(page, limit, 'completed');
    }
    public allTrips(page: number, limit: number) {
        return this.loadTrips(page, limit);
    }
    public trip(id: number) {
        return Trip.query().where('id', id)
            .preload('driver')
            .preload('geolocation')
            .preload('rider')
            .preload('status')
            .preload('vehicleSpecs', spec => spec.preload('luggagePictures'))
            .firstOrFail();
    }
    public serializeMatchedVehicles(vehicle: MatchVehicle, tripId: number) {
        const { geolocation, driver: { profilePicture, id } } = vehicle;
        const trip_id = tripId;
        const address = geolocation.address;
        const profile_picture = profilePicture ? profilePicture.url : null;
        const distance_from_rider = `${vehicle.distanceFromReference / 1000}km`
        const approximate_time_to_arrive = 0;
        const driver_id = id;
        return { trip_id, address, driver_id, profile_picture, distance_from_rider, approximate_time_to_arrive }
    }
    public async serializeTripForMatchedVehicle(vehicle: MatchVehicle, tripId: number) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('rider', rider => rider.preload('userData'))
                .preload('geolocation').firstOrFail();
            const riderPickupAddress = trip.fromAddress;
            const riderDestinationAddress = trip.toAddress;
            const riderPhoneNumber = trip.rider.userData.phoneNumber;
            const distanceFromRider = `${vehicle.distanceFromReference / 1000}km`
            return { tripId, driverId: vehicle.driverId, riderPickupAddress, riderDestinationAddress, riderPhoneNumber, distanceFromRider }
        } catch (error) {
            throw error;
        }
    }
    public async matchNearestDriver(destination: Geolocation, tripId: number) {
        try {
            const nearestDrivers = await this.matchTripRequestToDrivers(tripId);
            const nearestDriver = GeoService.nearestVehicle(destination, 1, nearestDrivers);
            //Check if driver's distance meets the threshold distance from rider;
            //If it meets the threshold, serialize the payload and notify the driver
            //Assumming it meets the threshold.
            return nearestDriver;
            // const driverPayload = await this.serializeTripForMatchedVehicle(nearestDriver, tripId);
            // return driverPayload;

        } catch (error) {
            throw error;
        }
    }
    public async matchTripRequestToDrivers(tripId: number): Promise<MatchVehicle[]> {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('geolocation')
                .preload('vehicleSpecs', spec => spec.preload('luggagePictures'))
                .firstOrFail();
            const driversMatchingSpecs = await this.driversMatchingVehicleSpec(trip)
            return driversMatchingSpecs;
        } catch (error) {
            throw error;
        }
    }
    public async acceptTripRequest(tripId: number, driverId: number) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('vehicleSpecs').firstOrFail();

            //Check if trip has already been accepted by another driver
            // if (trip.isAccepted)
            //     return this.tripAlreadyAccepted(trip, driverId)

            //Open a database transaction
            const trx = await Database.transaction();
            trip.driverId = driverId;
            const { vehicleSpecs: { vehicleType, numberOfSeats } } = trip;
            switch (vehicleType) {
                case 'bike':
                    await this.updateOnlineBike(driverId, trx, tripId);
                    break;
                case 'keke':
                    await this.updateOnlineTricycle(driverId, numberOfSeats!, trx, tripId)
                    break;
                default:
                    break;
            }
            trip.acceptedAt = DateTime.fromJSDate(new Date())
            trip.useTransaction(trx);
            await trip.save();

            //Commit transaction;
            await trx.commit();

            //Notify rider that request has been accepted;
            console.log('notifying rider that driver is on the way...');
            Event.emit('trip:accepted', trip);
            return trip;

        } catch (error) {
            throw error
        }
    }

    public async rejectTripRequest(tripId: number, driverId: number) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('vehicleSpecs').firstOrFail();

            // console.log(trip, driverId);
            const { rejections, numberOfMatches, vehicleSpecs: { vehicleType } } = trip;


            //Check if this trip has been rejected the maximun number of times set for it
            if (rejections === numberOfMatches) {
                //Notify the rider that the request can't be fullfilled
                return this.tripRequestRejected(trip);
            }

            //Open database transaction
            const trx = await Database.transaction();

            //Update the status of the vehicle/driver that just rejected this trip
            //so that this trip request won't be sent to them in the next iteration
            if (vehicleType === 'bike') {
                const bike = await OnlineBike.query().where('driver_id', driverId)
                    .firstOrFail();
                bike.rejectedTripId = trip.id;
                await bike.useTransaction(trx).save()
            }
            else {
                const bike = await OnlineTricycle.query().where('driver_id', driverId)
                    .firstOrFail();
                bike.rejectedTripId = trip.id;
                await bike.useTransaction(trx).save();
            }
            trip.previouslyRejected = true;
            trip.rejections = trip.rejections + 1;
            await trip.useTransaction(trx).save();

            await trx.commit();

            //Emit an event with the trip id to iterate over the demand/supply
            //matching workflow
            Event.emit('iterate:trip:request:matching', tripId);
            return;

        } catch (error) {
            throw error
        }
    }
    public async startTrip(tripId: number) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('status').firstOrFail();
            trip.status.status = 'intransit';
            trip.startedAt = DateTime.fromJSDate(new Date());
            await trip.save();
            await trip.status.save();
            return trip;
        } catch (error) {
            throw error;
        }
    }
    public async completeTrip(tripId: number, driverId: number) {
        try {
            const trip = await Trip.query().where('id', tripId)
                .preload('vehicleSpecs')
                .preload('status').firstOrFail();
            trip.status.status = 'completed';
            trip.endedAt = DateTime.fromJSDate(new Date());
            const startedAt = DateTime.fromISO(trip.startedAt.toJSON()).toMillis();
            trip.lastedFor = (trip.endedAt.toMillis() - startedAt) + ''
            await trip.save();
            await trip.status.save();
            const { vehicleSpecs: { vehicleType } } = trip;
            if (vehicleType === 'bike') {
                await this.updateOnlineBikeOnTripCompleted(driverId);
            } else {
                await this.updateOnlineTricycleOnTripCompleted(trip, driverId);
            }
            return trip;
        } catch (error) {
            throw error;
        }
    }
    public async cancelTrip(tripId: number) {
        console.log('canceling trip...', tripId)
    }
    private async updateOnlineBikeOnTripCompleted(driverId: number) {
        try {
            const bike = await OnlineBike.query()
                .where('driver_id', driverId).firstOrFail();
            bike.inTransit = false;
            return bike.save();
        } catch (error) {
            throw error;
        }
    }
    private async updateOnlineTricycleOnTripCompleted(trip: Trip, driverId: number) {
        try {
            const tricycle = await OnlineTricycle.query()
                .where('driver_id', driverId).firstOrFail();
            const { vehicleSpecs: { isCharter, numberOfSeats } } = trip;
            if (isCharter) {
                tricycle.inTransit = false;
                return tricycle.save();
            }
            const seats = numberOfSeats as number;
            tricycle.availableSeats = tricycle.availableSeats + seats;
            return tricycle.save();

        } catch (error) {
            throw error;
        }
    }

    //Notifies the rider that their request couldn't be fulfilled
    private async tripRequestRejected(trip: Trip) {
        try {
            return Event.emit('trip:maximum:rejections', trip);
        } catch (error) {
            throw error;
        }
    }
    private driversMatchingVehicleSpec(trip: Trip): Promise<MatchVehicle[]> {
        const { vehicleSpecs: { vehicleType } } = trip;
        try {
            if (vehicleType === 'bike') {
                return this.matchBikeDrivers(trip)
            }
            return this.matchTricycleDrivers(trip);
        } catch (error) {
            throw error;
        }
    }
    private matchTricycleDrivers(trip: Trip): Promise<any[]> {
        const { previouslyRejected, vehicleSpecs: { isCharter, numberOfSeats } } = trip;
        const query = OnlineTricycle.query();

        //Exempt drivers who had previously rejected this very trip
        if (previouslyRejected) {
            query.where('rejected_trip_id', '!=', trip.id);
        }
        if (isCharter) {
            return query
                .where('in_transit', false)
                .preload('driver')
                .preload('geolocation');
        }
        return query
            .where('available_seats', '>=', numberOfSeats!)
            .preload('driver')
            .preload('geolocation');
    }
    private matchBikeDrivers(trip: Trip): Promise<any[]> {
        const { previouslyRejected } = trip;
        const query = OnlineBike.query();

        //Exempt drivers who had previously rejected this very trip
        if (previouslyRejected) {
            query.where('rejected_trip_id', '!=', trip.id);
        }
        return query
            .where('in_transit', false)
            .preload('driver')
            .preload('geolocation');
    }

    private loadTrips(page: number, limit: number, status?: string) {
        const query = Trip.query();
        if (status) {
            query.whereHas('status', status => status.where('status', status))
        }
        return query
            .preload('geolocation')
            .preload('status')
            .preload('vehicleSpecs', spec => spec.preload('luggagePictures'))
            .preload('driver')
            .preload('rider')
            .paginate(page, limit);
    }
    private async updateOnlineBike(driverId: number, trx: any, tripId: number) {
        try {
            const bike = await OnlineBike.query()
                .where('driver_id', driverId).firstOrFail();
            bike.inTransit = true;
            bike.useTransaction(trx);
            bike.tripId = tripId
            return bike.save();
        } catch (error) {
            throw error
        }
    }
    private async updateOnlineTricycle(driverId: number, numberOfSeats: number, trx: any, tripId: number) {
        try {
            const tricycle = await OnlineTricycle.query()
                .where('driver_id', driverId).firstOrFail();
            tricycle.availableSeats = tricycle.availableSeats - numberOfSeats;
            tricycle.inTransit = true;
            tricycle.tripId = tripId;
            tricycle.useTransaction(trx);
            return tricycle.save();
        } catch (error) {
            throw error
        }
    }

}

export default new TripService();
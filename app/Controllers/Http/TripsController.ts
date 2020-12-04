import Event from '@ioc:Adonis/Core/Event';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CONSTANTS, CARRIAGE_FOLDER } from "../../../utils";
import TripService from '../../../services/TripService'
import UtilService from '../../../services/UtilService';
import TripVehicleSpec from 'App/Models/TripVehicleSpec';
import Database from '@ioc:Adonis/Lucid/Database';
import Trip from 'App/Models/Trip';
import TripGeolocation from 'App/Models/TripGeolocation';
import { messages } from '../../../utils'

export default class TripsController {

    public async index({ request }: HttpContextContract) {
        try {
            let { page, limit, filter } = request.all();
            limit = limit > CONSTANTS.LIMIT || !limit ? CONSTANTS.LIMIT : limit;
            page = page || 1;
            switch (filter) {
                case 'canceled':
                    return TripService.canceledTrips(page, limit);
                case 'completed':
                    return TripService.completedTrips(page, limit);
                case 'intransit':
                    return TripService.tripsIntransit();
                case 'active':
                    return TripService.tripsIntransit();
                case 'pending':
                    return TripService.pendingTrips(page, limit);
                default:
                    return TripService.allTrips(page, limit);
            }
        } catch (error) {
            throw error;
        }
    }
    public async show({ params }: HttpContextContract) {
        try {
            return TripService.trip(params.id);
        } catch (error) {
            throw error;
        }
    }
    public async bookTrip(ctx: HttpContextContract) {
        try {
            const { auth: { user } } = ctx;
            const payload = await this.validateTrip(ctx);
            const { distance, price, fromAddress, toAddress, geolocation, vehicleSpecs } = payload;
            const { luggagePictures, isCarriage, isCharter, numberOfSeats, vehicleType } = vehicleSpecs;
            let images;
            if (luggagePictures && luggagePictures.length) {
                const promises = luggagePictures.map(luggage => UtilService.savePhoto(luggage, CARRIAGE_FOLDER));
                images = await Promise.all(promises);
            }
            //Create a transaction;
            const trx = await Database.transaction();

            await user!.preload('rider');

            //Create and save trip
            const trip = new Trip();
            trip.price = price;
            trip.distance = distance;
            trip.fromAddress = fromAddress;
            trip.toAddress = toAddress;
            trip.riderId = user!.rider.id;
            trip.useTransaction(trx);
            const savedTrip = await trip.related('status').create({ status: 'pending' });

            //Create and save geolocation
            const geoLoc = new TripGeolocation();
            geoLoc.fromLatitude = geolocation.fromLocation.latitude;
            geoLoc.fromLongitude = geolocation.fromLocation.longitude;
            geoLoc.toLatitude = geolocation.toLocation.latitude;
            geoLoc.toLongitude = geolocation.toLocation.longitude;
            geoLoc.tripId = savedTrip.id;
            geoLoc.useTransaction(trx);
            await geoLoc.save();

            //Create and save spec
            const spec = new TripVehicleSpec();
            spec.isCarriage = isCarriage;
            spec.isCharter = isCharter;
            spec.numberOfSeats = numberOfSeats;
            spec.vehicleType = vehicleType;
            spec.tripId = savedTrip.id;
            spec.useTransaction(trx);
            if (images && images.length) {
                await spec.related('luggagePictures').createMany(images);
            }
            else {
                await spec.save();
            }

            //Commit transaction
            await trx.commit();

            // const matchedDriversBySpec = await TripService.matchTripRequestToDrivers(savedTrip.id);
            const { toLocation: { latitude: lat, longitude: long } } = geolocation;
            // const nearestMatches = GeoService.nearestVehicles({ latitude: +lat, longitude: +long }, 1, matchedDriversBySpec);
            // return nearestMatches.map(vehicle => {
            //     return TripService.serializeMatchedVehicles(vehicle, savedTrip.id);
            // });
            const nearestDriver = await TripService.matchNearestDriver({ latitude: lat, longitude: long }, savedTrip.id);
            //Check if driver's distance meets the threshold distance from rider;
            //If it meets the threshold, serialize the payload and notify the driver
            //Assumming it meets the threshold.
            if (nearestDriver) {
                const serializedTrip = await TripService.serializeTripForMatchedVehicle(nearestDriver, savedTrip.id);
                console.log('trip', UtilService.toSnakeCase(serializedTrip));
                //Notifiy matched driver
                Event.emit('trip:driver:matched', serializedTrip);
                return { isMatched: true }
            }
            return { isMatched: false }
        } catch (error) {
            throw error;
        }
    }
    public async acceptTrip(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            await user!.preload('driver');
            const { id } = await UtilService.validateIdParam(ctx, 'trips');
            return TripService.acceptTripRequest(id, user!.driver.id);
        } catch (error) {
            throw error
        }


    }
    public async rejectTrip(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            await user!.preload('driver');
            const { id } = await UtilService.validateIdParam(ctx, 'trips');
            return TripService.rejectTripRequest(id, user!.driver.id);
        } catch (error) {
            throw error
        }
    }
    public async cancelTrip(ctx: HttpContextContract) {
        try {
            // const { auth } = ctx;
            // const user = auth.user;
            // await user!.preload('driver');
            const { id } = await UtilService.validateIdParam(ctx, 'trips');
            return TripService.cancelTrip(id);
        } catch (error) {
            throw error
        }
    }
    public async startTrip(ctx: HttpContextContract) {
        try {
            // const { auth } = ctx;
            // const user = auth.user;
            // await user!.preload('driver');
            const { id } = await UtilService.validateIdParam(ctx, 'trips');
            return TripService.startTrip(id);
        } catch (error) {
            throw error
        }

    }
    public async completeTrip(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            await user!.preload('driver');
            const { id } = await UtilService.validateIdParam(ctx, 'trips');
            return TripService.completeTrip(id, user!.driver.id);
        } catch (error) {
            throw error
        }

    }
    private validateTrip(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                distance: schema.number(),
                price: schema.number(),
                fromAddress: schema.string({ trim: true }),
                toAddress: schema.string({ trim: true }),
                geolocation: schema.object().members({
                    fromLocation: schema.object().members({
                        latitude: schema.number(),
                        longitude: schema.number(),
                    }),
                    toLocation: schema.object().members({
                        latitude: schema.number(),
                        longitude: schema.number(),
                    }),
                }),
                vehicleSpecs: schema.object().members({
                    vehicleType: schema.enum(['keke', 'bike']),
                    numberOfSeats: schema.number.optional([
                        rules.requiredWhen('vehicleType', '=', 'keke')
                    ]),
                    isCharter: schema.boolean.optional([
                        rules.requiredWhen('vehicleType', '=', 'keke')
                    ]),
                    isCarriage: schema.boolean.optional([
                        rules.requiredWhen('vehicleType', '=', 'keke')
                    ]),
                    luggagePictures: schema.array.optional([
                        rules.minLength(1),
                        rules.maxLength(4),
                        rules.requiredWhen('isCarriage', '=', true)
                    ]).members(schema.file({
                        size: "2mb",
                        extnames: ["jpg", "png", "jpeg"],
                    }))
                })
            }),
            messages
        })
    }
    public validateDriverPick(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                tripId: schema.number([rules.exists({ table: 'trips', column: 'id' })]),
                driverId: schema.number([rules.exists({ table: 'drivers', column: 'id' })]),

            }),
            messages
        })
    }
}

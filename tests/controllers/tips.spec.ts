import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import Route from '@ioc:Adonis/Core/Route';
import { createDriverWithVehicle, login, createRider, NOTIFICATION_TOKEN } from '../helpers';
import { tripPayload } from "../data";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`


test.group('trips tests', (group) => {
    let driverToken;
    let riderToken;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        const onlineDriver = await createDriverWithVehicle();
        const { user: { email, phoneNumber }, password } = onlineDriver;

        driverToken = await login({ email, phoneNumber, password });
        const rider = await createRider();
        riderToken = await login(rider);
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    })

    test('book a trip', async (assert) => {
        //Assign device token to  online driver;
        const route = Route.makeUrl('register-token') as string;
        await supertest(BASE_URL).post(route)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({
                token: NOTIFICATION_TOKEN
            })
            .accept('application/json')
            .expect(200)
        // const driv = await Driver.query().where('id', body.driver_id)
        //     .preload('token').firstOrFail();
        // console.log('the driver is ', driv.toJSON())
        //Take driver online so that they would available for booking
        const goOnlineRoute = Route.makeUrl('go-online') as string;
        await supertest(BASE_URL).put(goOnlineRoute)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({
                latitude: 40.7676919,
                longitude: -73.98513559999999
            })
            .accept('application/json')
            .expect(200);

        //Book trip using rider's token
        const bookTripRoute = Route.makeUrl('book-trip') as string;
        const { body: { trip_id, is_matched } } = await supertest(BASE_URL).post(bookTripRoute)
            .set('Authorization', `Bearer ${riderToken}`)
            .send(tripPayload)
            .accept('application/json')
            .expect(200);

        assert.isDefined(trip_id);
        assert.isBoolean(is_matched)
    })

})
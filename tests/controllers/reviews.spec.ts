import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import Trip from 'App/Models/Trip';
import { createAdmin, createDriver, createRider, login } from '../helpers';
// import Route from '@ioc:Adonis/Core/Route';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Trip reviews tests', (group) => {
    let rider;
    let driver;
    let admin;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        rider = await createRider();
        driver = await createDriver();
        admin = await createAdmin()
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('Functional: Review a trip by a rider', async (assert) => {
        //Create a trip
        const trip = new Trip();
        trip.price = 1500;
        trip.distance = 5;
        trip.fromAddress = '03 Island Avenue';
        trip.toAddress = '93 Mainland Avenue';
        trip.riderId = rider.riderId;
        await trip.save();

        //Login
        const token = await login(rider);

        const { body: { status, data } } = await supertest(BASE_URL).post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({ tripId: trip.id, comment: 'Good experience', stars: 4 })
            .accept('application/json')
            .expect(200);

        assert.isTrue(status)
        assert.isDefined(data.id);
    })
    test('Functional: Review a trip by a driver', async (assert) => {
        //Create a trip
        const trip = new Trip();
        trip.price = 1500;
        trip.distance = 5;
        trip.fromAddress = '03 Island Avenue';
        trip.toAddress = '93 Mainland Avenue';
        trip.driverId = driver.driverId;
        await trip.save();

        //Login
        const token = await login(driver);

        const { body: { status, data } } = await supertest(BASE_URL).post('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({ tripId: trip.id, comment: 'Good experience', stars: 4 })
            .accept('application/json')
            .expect(200);

        assert.isTrue(status)
        assert.isDefined(data.id);
    })

    test('Functional: Retrieve all the reviews', async (assert) => {
        //Login
        const token = await login(admin);

        const { body: { status, data } } = await supertest(BASE_URL).get('/api/v1/reviews')
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);

        assert.isTrue(status);
        assert.isArray(data);

    })

})
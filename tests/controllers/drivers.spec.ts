import Route from '@ioc:Adonis/Core/Route';
import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import { login } from '../helpers';
import { nanoid } from 'nanoid';
import User from 'App/Models/User';
import Vehicle from 'App/Models/Vehicle';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;


test.group('Drivers controller tests', (group) => {
    let user;
    let token;
    let vehicle: Vehicle;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        //Create new user
        const email = nanoid() + '@gmail.com';
        const password = nanoid();
        const phoneNumber = nanoid()
        user = new User();
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.password = password;

        const driver = await user.related('driver').create({ verified: false, suspended: false, bvn: nanoid(), });
        vehicle = new Vehicle();
        vehicle.vehicleType = 'keke';
        vehicle.modelNumber = nanoid();
        vehicle.plateNumber = nanoid();
        vehicle.driverId = driver.id;
        await vehicle.save();
        //Login in to get a token
        token = await login({ email, phoneNumber, password });
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    })

    test('Functional: Go online', async (assert) => {
        const route = Route.makeUrl('go-online') as string;
        const { body } = await supertest(BASE_URL).put(route)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: 40.7676919,
                longitude: -73.98513559999999
            })
            .accept('application/json')
            .expect(200);
        const response = { status: true, message: 'Vehicle online', data: { is_online: true, vehicle_type: vehicle.vehicleType } }
        assert.deepEqual(body, response);
    })
    test('Functional: Go offline', async (assert) => {
        const route = Route.makeUrl('go-offline') as string;
        const { body } = await supertest(BASE_URL).put(route)
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        const response = { status: true, message: 'Vehicle offline', data: { is_online: false, vehicle_type: vehicle.vehicleType } }
        assert.deepEqual(body, response);
    })
})
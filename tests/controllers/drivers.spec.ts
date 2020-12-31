import Route from '@ioc:Adonis/Core/Route';
import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import { login, createDriverWithVehicle } from '../helpers';
import Vehicle from 'App/Models/Vehicle';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;


test.group('Drivers controller tests', (group) => {
    let token;
    let vehicle: Vehicle;
    group.before(async () => {
        await Database.beginGlobalTransaction();

        const onlineDriver = await createDriverWithVehicle();
        vehicle = onlineDriver.vehicle;
        const { user: { email, phoneNumber }, password } = onlineDriver;
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
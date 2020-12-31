import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import Route from '@ioc:Adonis/Core/Route';
import { createRider } from '../helpers';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('authentication tests', (group) => {
    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('user login', async (assert) => {
        //Create new user
        const user = await createRider();

        const route = Route.makeUrl('login') as string;
        const { body } = await supertest(BASE_URL).post(route)
            .send({ ...user })
            .accept('application/json')
            .expect(200);
        // console.log('res', body);
        assert.property(body, 'token');
    })
    test('register and login a rider', async (assert) => {
        const phoneNumber = '09058302936';
        const password = 'password'
        const route = Route.makeUrl('register') as string;
        const { body } = await supertest(BASE_URL).post(route)
            .send({ phoneNumber, password })
            .accept('application/json')
            .expect(200);

        assert.isDefined(body.token);
        assert.equal(body.role, 'rider');
    })
    test('register and login a driver', async (assert) => {
        const phoneNumber = '07058702936';
        const password = 'password'
        const route = Route.makeUrl('register') as string;
        const { body } = await supertest(BASE_URL).post(route)
            .send({ phoneNumber, password, isDriver: true })
            .accept('application/json')
            .expect(200);

        assert.isDefined(body.token);
        assert.equal(body.role, 'driver');
    })
})
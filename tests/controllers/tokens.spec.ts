import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import Route from '@ioc:Adonis/Core/Route';
import { createRider, login, NOTIFICATION_TOKEN, MOBILE_TOKEN } from '../helpers';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('token update tests', (group) => {
    let rider;
    let token;
    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
        rider = await createRider();
        token = await login(rider);
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('add new token', async (assert) => {
        const route = Route.makeUrl('register-token') as string;
        const { body } = await supertest(BASE_URL).post(route)
            .set('Authorization', `Bearer ${token}`)
            .send({
                token: NOTIFICATION_TOKEN
            })
            .accept('application/json')
            .expect(200)
        assert.equal(body.token, NOTIFICATION_TOKEN);
    })
    test('update already existing token token', async (assert) => {
        const route = Route.makeUrl('update-token') as string;
        const { body } = await supertest(BASE_URL).put(route)
            .set('Authorization', `Bearer ${token}`)
            .send({
                token: MOBILE_TOKEN
            })
            .accept('application/json')
            .expect(200);
        assert.equal(body.token, MOBILE_TOKEN);

    })
})
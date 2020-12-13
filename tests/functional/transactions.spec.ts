import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('transactions tests', (group) => {
    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('initialize transaction', async (assert) => {
        //Login in to get a token
        const { body: { token } } = await supertest(BASE_URL).post('/api/v1/auth/login')
            .send({
                email: 'Euna62@gmail.com',
                password: 'password'
            })
            .accept('application/json')
            .expect(200);
        //Make an authenticated request
        const { body } = await supertest(BASE_URL).post('/api/v1/transactions/initialize')
            .send({
                amount: 700
            })
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        // console.log('body', body)
        assert.hasAllKeys(body, ['access_code', 'reference', 'amount'])

    })
})
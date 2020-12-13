import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('authentication tests', (group) => {
    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('user login', async (assert) => {
        const { body } = await supertest(BASE_URL).post('/api/v1/auth/login')
            .send({
                email: 'Euna62@gmail.com',
                password: 'password'
            })
            .accept('application/json')
            .expect(200);
        // console.log('res', body);
        assert.property(body, 'token');
    })
})
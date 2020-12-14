import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import UtilService from 'App/Services/UtilService';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('transactions tests', (group) => {
    let user;
    let token;
    let reference;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        //Create new user
        user = await UtilService.fakeRider()
        //Login in to get a token
        token = await login(user);
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    })
    async function login(user: any) {
        const { body: { token } } = await supertest(BASE_URL).post('/api/v1/auth/login')
            .send({ ...user })
            .accept('application/json')
            .expect(200);
        return token;
    }
    test('Functional: initialize transaction', async (assert) => {
        // const ;

        //Make an authenticated request
        const { body } = await supertest(BASE_URL).post('/api/v1/transactions/initialize')
            .send({
                amount: 70
            })
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        // console.log('body', body)
        reference = body.reference;
        assert.hasAllKeys(body, ['access_code', 'reference', 'amount'])

    })
    test('Functional: verify transaction', async (assert) => {
        const { body } = await supertest(BASE_URL).get('/api/v1/transactions/verify/' + reference)
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        // console.log('body', body)
        const { data: { is_transaction_successful, previous_balance, current_balance } } = body;
        if (!is_transaction_successful) {
            assert.equal(previous_balance, current_balance)
        } else {
            assert.notEqual(previous_balance, current_balance);
        }

    })
})
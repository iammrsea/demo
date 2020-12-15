import Route from '@ioc:Adonis/Core/Route';
import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import UtilService from 'App/Services/UtilService';
import { login } from '../helpers';
import Trip from 'App/Models/Trip';
import Wallet from 'App/Models/Wallet';

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

    test('Functional: initialize transaction', async (assert) => {
        const route = Route.makeUrl('initialize-transaction') as string;
        //Make an authenticated request
        const { body } = await supertest(BASE_URL).post(route)
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
        const route = Route.makeUrl('verify-transaction', {
            params: { reference }
        }) as string;
        const { body } = await supertest(BASE_URL).get(route)
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
    test('Functional: make payment for a trip', async (assert) => {

        //Create a trip
        const trip = new Trip();
        trip.price = 1500;
        trip.distance = 5;
        trip.fromAddress = '03 Island Avenue';
        trip.toAddress = '93 Mainland Avenue';
        trip.riderId = user.riderId;
        await trip.save();

        //Create wallet for user;
        const wallet = new Wallet();
        wallet.balance = 4000;
        wallet.riderId = user.riderId;
        await wallet.save();

        const route = Route.makeUrl('pay-for-trip') as string;
        const { body: { status, data } } = await supertest(BASE_URL).post(route)
            .set('Authorization', `Bearer ${token}`)
            .send({ tripId: trip.id })
            .accept('application/json')
            .expect(200);

        assert.isTrue(status);
        assert.equal(data.previous_balance, 4000);
        assert.equal(data.current_balance, 2500);

    })
})
import test from 'japa';
import PaystackService from 'App/Services/PaystackService';
import { nanoid } from "nanoid";

test.group('paystack service tests', () => {

    test('initialize a transaction', async (assert) => {
        const payload = {
            amount: 3000,
            email: 'johndoe@gmail.com',
            firstName: 'John',
            lastName: 'Doe',
            reference: nanoid()
        };
        const { data } = await PaystackService.initializeTransaction(payload);
        // console.log(data);
        assert.equal(data.status, true);
        assert.isDefined(data.data);
    });
    test('list of bank codes', async (assert) => {
        const { data } = await PaystackService.codes(5, 1);
        // console.log(data);
        assert.isDefined(data.data);
        assert.isTrue(data.status);
        assert.isNotEmpty(data.data);
    })
    test('verify transaction', async (assert) => {
        const { data } = await PaystackService.verify('VDF1fyb63Gd9WC6TkygoV');
        // console.log(data);
        assert.equal(data.data.status, 'abandoned')
    })
})
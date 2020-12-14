import test from 'japa';
import Database from '@ioc:Adonis/Lucid/Database';
import Transaction from 'App/Models/Transaction';
import TransactionService from 'App/Services/TransactionService';
import { nanoid } from 'nanoid';
import UtilService from 'App/Services/UtilService';


test.group('transactions service tests', (group) => {

    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })


    test('save transaction with only amount deposited field', async (assert) => {
        const { riderId, role } = await UtilService.fakeRider();
        const transaction = new Transaction();
        transaction.amountDeposited = 6000;
        transaction.transactionRef = nanoid()
        const result = await TransactionService.saveTransaction(transaction, role, riderId);
        await result.preload('rider');
        const { id, transaction_ref, amount_deposited, amount_remitted, amount_withdrawn } = result.toJSON();
        assert.equal(amount_deposited, 6000);
        assert.isDefined(id);
        assert.isDefined(transaction_ref);
        assert.isUndefined(amount_remitted);
        assert.isUndefined(amount_withdrawn)
        assert.isDefined(result.rider);
        assert.isDefined(result.rider.id);
    })
    test('save transaction with only amount widthdrawn field', async (assert) => {
        const { riderId, role } = await UtilService.fakeRider();
        const transaction = new Transaction();
        transaction.amountWithdrawn = 6000;
        transaction.transactionRef = nanoid()
        const result = await TransactionService.saveTransaction(transaction, role, riderId);
        await result.preload('rider');
        const { id, transaction_ref, amount_deposited, amount_remitted, amount_withdrawn } = result.toJSON();
        assert.equal(amount_withdrawn, 6000);
        assert.isDefined(id);
        assert.isDefined(transaction_ref);
        assert.isUndefined(amount_remitted);
        assert.isUndefined(amount_deposited)
        assert.isDefined(result.rider);
        assert.isDefined(result.rider.id);
    })
    test('save transaction with only amount remitted field', async (assert) => {
        const { riderId, role } = await UtilService.fakeRider();
        const transaction = new Transaction();
        transaction.transactionRef = nanoid()
        transaction.amountRemitted = 6000;
        const result = await TransactionService.saveTransaction(transaction, role, riderId);
        await result.preload('rider');
        const { id, transaction_ref, amount_deposited, amount_remitted, amount_withdrawn } = result.toJSON();
        assert.isUndefined(amount_withdrawn);
        assert.isDefined(id);
        assert.isDefined(transaction_ref);
        assert.equal(amount_remitted, 6000);
        assert.isUndefined(amount_deposited)
        assert.isDefined(result.rider);
        assert.isDefined(result.rider.id);
    })
    test('save transaction with the three fields', async (assert) => {
        const { riderId, role } = await UtilService.fakeRider();
        const transaction = new Transaction();
        transaction.transactionRef = nanoid()
        transaction.amountWithdrawn = 6000;
        transaction.amountDeposited = 5000;
        transaction.amountRemitted = 4000;
        const result = await TransactionService.saveTransaction(transaction, role, riderId);
        await result.preload('rider');
        const { id, transaction_ref, amount_deposited, amount_remitted, amount_withdrawn } = result.toJSON();
        assert.equal(amount_withdrawn, 6000);
        assert.isDefined(id);
        assert.isDefined(transaction_ref);
        assert.equal(amount_remitted, 4000);
        assert.equal(amount_deposited, 5000)
        assert.isDefined(result.rider);
        assert.isDefined(result.rider.id);
    })
})
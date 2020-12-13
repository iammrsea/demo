import test from 'japa';
import TransactionValidator from 'App/Services/validators/TransactionValidator';


test.group('validator tests', () => {
    test('transaction initialization payload', async (assert) => {
        const result = await TransactionValidator.initialize(60);
        assert.deepEqual(result, { amount: 60 });
    })
})
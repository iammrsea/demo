import test from 'japa';
import TransactionValidator from 'App/Services/validators/TransactionValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import UtilService from 'App/Services/UtilService';
import Trip from 'App/Models/Trip';


test.group('validator tests', (group) => {
    let user;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        //Create new user
        user = await UtilService.fakeRider()
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction()
    })
    test('transaction initialization payload', async (assert) => {
        const result = await TransactionValidator.initialize(60);
        assert.deepEqual(result, { amount: 60 });
    })
    test('payment payload', async (assert) => {
        //Create a trip
        const trip = new Trip();
        trip.price = 2000;
        trip.distance = 5;
        trip.fromAddress = '03 Island Avenue';
        trip.toAddress = '93 Mainland Avenue';
        trip.riderId = user.riderId;
        await trip.save();
        const { tripId } = await TransactionValidator.payment(trip.id);
        assert.isDefined(tripId)
        assert.deepEqual({ tripId }, { tripId: trip.id });
    })
})
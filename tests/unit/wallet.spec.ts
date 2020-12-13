import Database from '@ioc:Adonis/Lucid/Database';
import Wallet from 'App/Models/Wallet';
import test from 'japa';

test.group('Wallet unit tests', (group) => {
    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })
    test('has sufficient balance', async (assert) => {
        const wallet = new Wallet();
        wallet.balance = 5500;
        await wallet.save();
        assert.isTrue(wallet.hasSufficientBalance(4000));
    });
    test('add money', async (assert) => {
        const wallet = new Wallet();
        await wallet.addMoney(4000);
        assert.equal(wallet.balance, 4000);
        await wallet.addMoney(5000);
        assert.equal(wallet.balance, 9000);
        assert.equal(wallet.cummulativeAmount, 9000);

    });
    test('remove money', async (assert) => {
        const wallet = new Wallet();
        wallet.balance = 5000;
        await wallet.save();
        await wallet.removeMoney(3000);
        assert.equal(wallet.balance, 2000);
    })
})
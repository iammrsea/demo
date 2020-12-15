import Route from '@ioc:Adonis/Core/Route';

export default () => {
    Route.group(() => {
        Route.post('initialize', 'TransactionsController.initialize')
            .as('initialize-transaction')
            .middleware(['auth'])
        Route.get('verify/:reference', 'TransactionsController.verify')
            .as('verify-transaction')
            .middleware(['auth']);
        Route.post('payment', 'TransactionsController.payForTrip')
            .as('pay-for-trip')
            .middleware(['auth']);
    }).prefix('transactions')
}
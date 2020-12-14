import Route from '@ioc:Adonis/Core/Route';

export default () => {
    Route.group(() => {
        Route.post('initialize', 'TransactionsController.initialize')
            .middleware(['auth'])
        Route.get('verify/:reference', 'TransactionsController.verify')
            .middleware(['auth']);
    }).prefix('transactions')
}
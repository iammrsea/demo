import Route from '@ioc:Adonis/Core/Route';

export default () => {
    Route.group(() => {
        Route.post('initialize', 'TransactionsController.initialize')
            .middleware(['auth'])
    }).prefix('transactions')
}
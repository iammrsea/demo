import Route from '@ioc:Adonis/Core/Route';

export default () => {
    Route.group(() => {
        Route.post('trips/book', 'TripsController.bookTrip')
            .as('book-trip')
        Route.post('trips/:id/accept', 'TripsController.acceptTrip')
            .as('accept-trip')
        Route.post('trips/:id/reject', 'TripsController.rejectTrip')
            .as('reject-trip')
        Route.post('trips/:id/cancel', 'TripsController.cancelTrip')
            .as('cancel-trip')
        Route.post('trips/:id/start', 'TripsController.startTrip')
            .as('start-trip')
        Route.post('trips/:id/complete', 'TripsController.completeTrip')
            .as('complete-trip');
    }).middleware(['auth']);
    Route.resource('trips', 'TripsController')
        .apiOnly()
        .only(['index', 'destroy', 'show'])
}
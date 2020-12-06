import Route from '@ioc:Adonis/Core/Route';

export default () => {
    Route.group(() => {
        Route.post('trips/book', 'TripsController.bookTrip')
        Route.post('trips/:id/accept', 'TripsController.acceptTrip')
        Route.post('trips/:id/reject', 'TripsController.rejectTrip')
        Route.post('trips/:id/cancel', 'TripsController.cancelTrip')
        Route.post('trips/:id/start', 'TripsController.startTrip')
        Route.post('trips/:id/complete', 'TripsController.completeTrip')
    }).middleware(['auth']);
    Route.resource('trips', 'TripsController')
        .apiOnly()
        .only(['index', 'destroy', 'show'])
}
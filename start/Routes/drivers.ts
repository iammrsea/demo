import Route from "@ioc:Adonis/Core/Route";

export default () => {

    Route.group(() => {
        Route.get('tricycles/online', 'DriversController.tricyclesOnline')
        Route.get('tricycles/intransit', 'DriversController.tricyclesIntransit')
        Route.get('bikes/online', 'DriversController.bikesOnline')
        Route.get('bikes/intransit', 'DriversController.bikesIntransit')
        Route.get('bikes', 'DriversController.bikes')
        Route.get('tricycles', 'DriversController.tricycles')
        Route.get('vehicles', 'DriversController.vehicles')
        Route.put('toggle-on', 'DriversController.switchOn').middleware(['auth']);
        Route.put('toggle-off', 'DriversController.switchOff').middleware(['auth']);
        Route.put(':id/change-photo', 'DriversController.changePhoto')
            .middleware([])
        Route.group(() => {
            Route.put(':id', 'DriversController.updateDriver');
            Route.put(':id/personal-data', 'DriversController.addPersonalData');
            Route.put(':id/address', 'DriversController.addAddress');
            Route.put(':id/vehicle', 'DriversController.addVehicleData');
        }).middleware(['auth'])
        Route.get(':id', 'DriversController.show')
        Route.get('/', 'DriversController.index')
    }).prefix('drivers')
}
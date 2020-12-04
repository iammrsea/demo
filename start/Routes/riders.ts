import Route from "@ioc:Adonis/Core/Route";

export default () => {
    Route.group(() => {
        Route.put(':id/change-photo', 'RidersController.changePhoto')
            .middleware([])
        Route.put(':id', 'RidersController.updateRider')
        Route.get(':id', 'RidersController.show')
        Route.get('/', 'RidersController.index')
    }).prefix('riders')
}
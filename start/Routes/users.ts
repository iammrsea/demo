import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.put(':id/change-photo', 'UsersController.changePhoto')
      .middleware([])
    Route.put(':id', 'UsersController.updateRider')
    Route.get(':id', 'UsersController.show')
  }).prefix('users/riders')

  Route.group(() => {
    Route.put(':id/change-photo', 'UsersController.changePhoto')
      .middleware([])
    Route.put(':id', 'UsersController.updateDriver');
    Route.put(':id/personal-data', 'UsersController.addPersonalData');
    Route.put(':id/address', 'UsersController.addAddress');
    Route.put(':id/vehicle', 'UsersController.addVehicleData');
    Route.get(':id', 'UsersController.show')
  }).prefix('users/drivers')

  Route.resource("users", "UsersController")
    .apiOnly()
    .only(['destroy', 'show', 'index', 'update'])
    .middleware({
      update: [],
      destroy: [],
    });
};

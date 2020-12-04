import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.post("bike-drivers", "FactoriesController.bikeDrivers");
    Route.post("tricycle-drivers", "FactoriesController.tricycleDrivers");
    Route.post("riders", "FactoriesController.riders");
    Route.post("users", "FactoriesController.users");
    Route.post("orders", "FactoriesController.orders");
    Route.post("reviews", "FactoriesController.reviews");
    Route.post("healthtips", "FactoriesController.healthTips");
  }).prefix("factories");
};

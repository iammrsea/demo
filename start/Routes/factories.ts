import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.post("news", "FactoriesController.news");
    Route.post("restaurants", "FactoriesController.restaurants");
    Route.post("users", "FactoriesController.users");
    Route.post("orders", "FactoriesController.orders");
    Route.post("reviews", "FactoriesController.reviews");
    Route.post("healthtips", "FactoriesController.healthTips");
  }).prefix("factories");
};

import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.post("tokens/register", "TokensController.createOrUpdate")
    .as('register-token')
    .middleware(['auth']);
  Route.put("tokens/update", "TokensController.createOrUpdate")
    .as('update-token')
    .middleware(['auth']);
};

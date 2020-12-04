import Route from "@ioc:Adonis/Core/Route";

export default () => {

  Route.resource("users", "UsersController")
    .apiOnly()
    .only(['destroy', 'show', 'index', 'update'])
    .middleware({
      update: [],
      destroy: [],
    });
};

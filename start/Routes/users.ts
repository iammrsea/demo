import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.put('users/:id/change-photo', 'UsersController.changePhoto')
    .middleware(['auth', 'acl:owner'])
  Route.put('users/dangiwa/update', 'UsersController.updateDangiwa')
    .middleware(['auth','acl:admin']);
  Route.get('users/dangiwa', "UsersController.dangiwa");
  Route.get('users/search', "UsersController.search");
  Route.resource("users", "UsersController")
    .apiOnly()
    .except(["store"])
    .middleware({ 
      update: ["auth", "acl:owner"],
      destroy: ["auth", "acl:admin"],
    });
};

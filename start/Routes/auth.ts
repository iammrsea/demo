import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.post("login", "AuthController.login")
      .as('login');
    Route.post("register", "AuthController.register")
      .as('register');
    Route.delete("logout", "AuthController.logout").middleware(["auth"])
      .as('logout');
  }).prefix("auth");
};

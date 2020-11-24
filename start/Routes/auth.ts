import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.post("login", "AuthController.login");
    Route.post("register", "AuthController.register");
    Route.delete("logout", "AuthController.logout").middleware(["auth"]);
  }).prefix("auth");
};

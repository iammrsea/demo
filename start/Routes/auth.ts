import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.group(() => {
    Route.post("local/login", "AuthController.localLogin");
    Route.post("login", "AuthController.localLogin");
    Route.post("register", "AuthController.register");
    Route.delete("logout", "AuthController.logout").middleware(["auth"]);
    Route.post("provider/login", "AuthController.providerLogin");
  }).prefix("auth");
};

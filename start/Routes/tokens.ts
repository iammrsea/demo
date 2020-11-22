import Route from "@ioc:Adonis/Core/Route";

export default () => {
  //Notification token
  Route.resource("tokens", "NotificationTokensController")
    .only(["store", "update"])
    .middleware({
      store: ["auth", "acl:admin"],
      update: ["auth", "acl:admin"],
    });
};

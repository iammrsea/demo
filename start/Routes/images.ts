import Route from "@ioc:Adonis/Core/Route";

export default () => {
  Route.resource("images", "ImagesController")
    .apiOnly()
    .middleware({
      store: ["auth", ],
      destroy: ["auth"],
      update: ["auth"],
    });
};

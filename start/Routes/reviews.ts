import Route from "@ioc:Adonis/Core/Route";

export default () => {
    Route.resource('reviews', 'ReviewsController')
        .apiOnly()
        .only(['store', 'index'])
        .middleware({
            index: ['auth', 'acl:admin'],
            store: ['auth']
        })
};

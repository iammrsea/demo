import Route from '@ioc:Adonis/Core/Route';

export default () => {

    Route.post('messages/add-reply', 'MessagesController.addReply')
        .as('add-reply')
        .middleware(['auth', 'acl:admin']);
    Route.put('messages/remove-reply', 'MessagesController.removeReply')
        .as('remove-reply')
        .middleware(['auth', 'acl:admin']);

    Route.resource('messages', 'MessagesController')
        .apiOnly()
        .middleware({
            index: ['auth'],
            show: ['auth'],
            store: ['auth'],
            destroy: ['auth'],
            update: ['auth']
        })
}
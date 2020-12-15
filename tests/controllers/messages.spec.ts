import test from 'japa';
import supertest from 'supertest';
import Database from '@ioc:Adonis/Lucid/Database';
import Route from '@ioc:Adonis/Core/Route';
import { createAdmin, createDriver, createMessage, createRider, login } from '../helpers';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Message controller tests', (group) => {
    let rider;
    let driver;
    let admin;

    group.beforeEach(async () => {
        await Database.beginGlobalTransaction();
        rider = await createRider();
        driver = await createDriver();
        admin = await createAdmin();
    })
    group.afterEach(async () => {
        await Database.rollbackGlobalTransaction();
    })

    test('Functional: add a message by a rider', async (assert) => {
        const token = await login(rider);
        const { body } = await createMessage('How do I fund my wallet?', token)
        assert.isDefined(body.data.id);
        assert.equal(body.data.text, 'How do I fund my wallet?');
        assert.isTrue(body.status);
    })
    test('Functional: add a message by a driver', async (assert) => {
        const token = await login(driver);
        const { body } = await createMessage('How do I cash out funds?', token);
        assert.isDefined(body.data.id);
        assert.equal(body.data.text, 'How do I cash out funds?');
        assert.isTrue(body.status);
    })

    test('Functional: update a message by id', async (assert) => {
        //Log in and add a message;
        const token = await login(rider);
        const { body: { data: { id, text } } } = await createMessage('How do I fund my wallet?', token);
        //Update the added message
        const { body: response } = await supertest(BASE_URL).put('/api/v1/messages/' + id)
            .set('Authorization', `Bearer ${token}`)
            .send({
                text: 'I have finally learnt how to fund my wallet, thanks!'
            })
            .accept('application/json')
            .expect(200);
        assert.equal(id, response.data.id);
        assert.equal(text, 'How do I fund my wallet?');
        assert.equal(response.data.text, 'I have finally learnt how to fund my wallet, thanks!')
    })
    test('Functional: delete message by id', async (assert) => {
        //Log in and add a message;
        const token = await login(rider);
        const { body: { data: { id } } } = await createMessage('How do I fund my wallet?', token);
        //Delete the added message
        const { body: { status, message } } = await supertest(BASE_URL).delete('/api/v1/messages/' + id)
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        assert.isTrue(status);
        assert.equal(message, 'Message deleted successfully');

    })

    test('Functional: Add a reply to a message', async (assert) => {
        //Log in and add a message;
        const token = await login(rider);
        const { body: { data: { id } } } = await createMessage('How do I fund my wallet?', token);

        //Log in as an admin
        const adminToken = await login(admin);

        const route = Route.makeUrl('add-reply') as string;

        //Add reply to the message
        const { body: { status, data: { message_replies } } } = await supertest(BASE_URL).post(route)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                text: 'Go to your dashboard and read the guides',
                messageId: id
            })
            .accept('application/json')
            .expect(200);

        assert.isTrue(status);
        assert.equal(message_replies.length, 1);

    })
    test('Functional: Remove reply from message replies', async (assert) => {
        //Log in and add a message;
        const token = await login(rider);
        const { body: { data: { id } } } = await createMessage('How do I fund my wallet?', token);

        //Log in as an admin
        const adminToken = await login(admin);

        const addReplyRoute = Route.makeUrl('add-reply') as string;

        //Add reply to the message
        const { body: { data: { message_replies: replies } } } = await supertest(BASE_URL).post(addReplyRoute)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                text: 'Go to your dashboard and read the guides',
                messageId: id
            })
            .accept('application/json')
            .expect(200);
        const reply = replies[0];

        const route = Route.makeUrl('remove-reply') as string;
        //Remove reply from the list of replies of a message
        const { body: { status, data: { message_replies } } } = await supertest(BASE_URL).put(route)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                messageId: id,
                replyId: reply.id
            })
            .accept('application/json')
            .expect(200);
        assert.isTrue(status);
        assert.equal(message_replies.length, 0);

    })

    test('Functional: Display a message by id to a logged in user', async (assert) => {
        //Log in and add a message;
        const token = await login(rider);
        const { body: { data: { id } } } = await createMessage('How do I fund my wallet?', token);

        //Log in as an admin
        const adminToken = await login(admin);

        //Get a message by its id
        const { body: { status, data } } = await supertest(BASE_URL).get('/api/v1/messages/' + id)
            .set('Authorization', `Bearer ${adminToken}`)
            .accept('application/json')
            .expect(200);
        // console.log('data', data);
        assert.isTrue(status);
        assert.isDefined(data);

    })

    async function createMessagesAndGetTokens() {
        //Log in and add a message as a rider; 
        const riderToken = await login(rider);
        await createMessage('How do I fund my wallet?', riderToken);

        //Log in and add a message as a driver;
        const driverToken = await login(driver);
        await createMessage('How do I cash out my funds?', driverToken);
        return { riderToken, driverToken };
    }

    test('Functional: Display messages to the admin user', async (assert) => {
        //Retrive and assign tokens
        await createMessagesAndGetTokens();
        //Login as admin
        const token = await login(admin);

        //Get a list of all available messages
        const { body: { status, data } } = await supertest(BASE_URL).get('/api/v1/messages')
            .set('Authorization', `Bearer ${token}`)
            .accept('application/json')
            .expect(200);
        assert.isTrue(status);
        assert.equal(data.length, 2);
    })
    test('Functional: Display messages to the rider user', async (assert) => {
        const { riderToken } = await createMessagesAndGetTokens();
        //Get a list of messages added by this rider
        const { body: { status, data } } = await supertest(BASE_URL).get('/api/v1/messages')
            .set('Authorization', `Bearer ${riderToken}`)
            .accept('application/json')
            .expect(200);
        // console.log('messages', data)
        assert.isTrue(status);
        assert.equal(data.length, 1);
    })
    test('Functional: Display messages to the driver user', async (assert) => {
        const { driverToken } = await createMessagesAndGetTokens();
        //Get a list of messages added by this rider
        const { body: { status, data } } = await supertest(BASE_URL).get('/api/v1/messages')
            .set('Authorization', `Bearer ${driverToken}`)
            .accept('application/json')
            .expect(200);
        // console.log('messages', data)
        assert.isTrue(status);
        assert.equal(data.length, 1);
    })
})
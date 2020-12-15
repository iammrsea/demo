import Database from '@ioc:Adonis/Lucid/Database';
import Message from 'App/Models/Message';
import test from 'japa';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';


test.group('Messaging unit tests', (group) => {
    let message: Message;
    group.before(async () => {
        await Database.beginGlobalTransaction();
        message = new Message();
        message.text = 'I want to know how to fund my wallet';
        message.messageReplies = [];
        await message.save();
    })
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    });

    test('Unit: add reply to a message', async (assert) => {
        const reply = {
            reply: 'Go to your dashboard and follow the guide',
            id: nanoid(),
            repliedAt: DateTime.fromJSDate(new Date()).toISO()
        }
        const reply2 = {
            reply: 'Click the button on the left',
            id: nanoid(),
            repliedAt: DateTime.fromJSDate(new Date()).toISO()
        }
        await message.addReply(reply);
        await message.addReply(reply2);
        // console.log(message.toJSON());
        assert.equal(message.messageReplies.length, 2);
    })

    test('Unit: Remove reply from a message', async (assert) => {
        const reply = message.messageReplies[0];
        await message.removeReply(reply.id);
        const removedReply = message.messageReplies.find(rep => rep.id === reply.id);
        assert.isUndefined(removedReply);
        assert.equal(message.messageReplies.length, 1);
    })

})
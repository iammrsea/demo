import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message';
import MessageValidator from 'App/Services/validators/MessageValidator';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';

export default class MessagesController {

    public async index({ auth }: HttpContextContract) {
        const user = auth.user;
        if (user!.role === 'admin') {
            const messages = await Message.query().orderBy('updated_at', 'desc')
            return {
                status: true, message: 'Messages fetched successfully',
                data: messages.map(message => message.toJSON())
            };
        }
        if (user!.role === 'rider') {
            await user!.preload('rider', rider => rider.preload('messages'));
            return {
                status: true, message: 'Messages fetched successfully',
                data: user!.rider.messages.map(message => message.toJSON())
            }
        }
        if (user!.role === 'driver') {
            await user!.preload('driver', driver => driver.preload('messages'));
            return {
                status: true, message: 'Messages fetched successfully',
                data: user!.driver.messages.map(message => message.toJSON())
            }
        };
    }
    public async show({ params }: HttpContextContract) {
        const { id } = params;
        const message = await Message.query().where('id', id)
            .preload('driver')
            .preload('rider').firstOrFail();
        return {
            status: true, message: 'Message fetched successfully',
            data: { ...message.toJSON() }
        }
    }
    public async store({ request, auth }: HttpContextContract) {
        const { text } = request.all();
        await MessageValidator.validateMessage(text);
        const user = auth.user;
        const message = new Message();
        message.text = text;
        message.messageReplies = []

        if (user!.role === 'rider') {
            await user!.preload('rider');
            message.riderId = user!.rider.id;
        }
        if (user!.role === 'driver') {
            await user!.preload('driver');
            message.driverId = user!.driver.id;
        }
        await message.save();
        return { status: true, message: 'Message added successfully', data: { id: message.id, text, replies: message.messageReplies } };
    }
    public async update({ params, request }: HttpContextContract) {
        const { text } = request.all();
        const { id } = params;
        await MessageValidator.validateMessage(text);

        const message = await Message.findByOrFail('id', id);
        message.text = text;
        await message.save();
        return { status: true, message: 'Message updated successfully', data: { id: message.id, text } }
    }
    public async destroy({ params }: HttpContextContract) {
        const { id } = params;
        const message = await Message.findByOrFail('id', id);
        await message.delete();
        return { status: true, message: 'Message deleted successfully' }
    }
    public async addReply({ request }: HttpContextContract) {
        const { messageId, text } = request.all();
        await MessageValidator.validateAddReply(messageId, text);
        const message = await Message.findByOrFail('id', messageId);
        const reply = {
            reply: text,
            id: nanoid(),
            repliedAt: DateTime.fromJSDate(new Date()).toISO()
        }
        await message.addReply(reply);
        return {
            status: true, message: 'Reply added successfully', data: {
                text: message.text,
                message_replies: message.messageReplies,
                id: message.id
            }
        }
    }
    public async removeReply({ request }: HttpContextContract) {
        const { messageId, replyId } = request.all();
        await MessageValidator.validateAddReply(messageId, replyId);
        const message = await Message.findByOrFail('id', messageId);
        await message.removeReply(replyId);
        return {
            status: true, message: 'Reply removed successfully', data: {
                text: message.text,
                message_replies: message.messageReplies,
                id: message.id
            }
        }
    }
}

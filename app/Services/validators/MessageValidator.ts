import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { messages } from "App/Utils";

class MessageValidator {

    public validateMessage(text: string) {
        return validator.validate({
            schema: schema.create({
                text: schema.string({ trim: true })
            }),
            data: { text },
            messages
        })
    }
    public validateAddReply(messageId: number, text: string) {
        return validator.validate({
            schema: schema.create({
                messageId: schema.number([
                    rules.exists({ table: 'messages', column: 'id' })
                ]),
                text: schema.string({ trim: true })
            }),
            messages,
            data: { messageId, text }
        })
    }
    public validateRemoveReply(messageId: number, replyId: string) {
        return validator.validate({
            schema: schema.create({
                messageId: schema.number([
                    rules.exists({ table: 'messages', column: 'id' })
                ]),
                text: schema.string({ trim: true })
            }),
            messages,
            data: { messageId, replyId }
        })
    }
}

export default new MessageValidator();
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { messages } from "App/Utils";
import { validator } from "@ioc:Adonis/Core/Validator";

class TransactionValidator {

    public initialize(amount: number) {
        return validator.validate({
            schema: schema.create({
                amount: schema.number([
                    rules.notLessThan50()
                ])
            }),
            messages,
            data: { amount }
        })
    }
    public payment(tripId: number) {
        return validator.validate({
            schema: schema.create({
                tripId: schema.number([
                    rules.exists({ table: 'trips', column: 'id' })
                ])
            }),
            data: { tripId },
            messages
        })
    }
}

export default new TransactionValidator();
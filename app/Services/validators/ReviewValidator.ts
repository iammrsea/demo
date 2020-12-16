import { schema, rules, validator } from '@ioc:Adonis/Core/Validator';
import { messages } from "App/Utils";

class ReviewValidator {
    public validateReview(stars: number, comment: string, tripId: number) {
        return validator.validate({
            schema: schema.create({
                stars: schema.number(),
                comment: schema.string({ trim: true }),
                tripId: schema.number([
                    rules.exists({ table: 'trips', column: 'id' })
                ])
            }),
            data: { stars, comment, tripId },
            messages
        })
    }
}

export default new ReviewValidator();
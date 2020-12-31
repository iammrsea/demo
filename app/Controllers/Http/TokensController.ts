import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Token from "App/Models/Token";

export default class TokensController {
    public async createOrUpdate({ request, auth }: HttpContextContract) {
        const user = auth.user;
        const { token } = await request.validate({
            schema: schema.create({
                token: schema.string({ trim: true }),
            }),
        });

        const { role } = user!;
        if (role === 'rider') {
            await user!.preload('rider');
            const savedToken = await Token.updateOrCreate({ riderId: user!.rider.id }, { token, riderId: user!.rider.id });
            return { token: savedToken.token, rider_id: savedToken.riderId };
        }
        if (role === 'driver') {
            await user!.preload('driver');
            const savedToken = await Token.updateOrCreate({ driverId: user!.driver.id }, { token, driverId: user!.driver.id });
            return { token: savedToken.token, driver_id: savedToken.driverId };
        }
        const savedToken = await Token.updateOrCreate({ userId: user!.id }, { token, userId: user!.id });
        return { token: savedToken.token, user_id: savedToken.userId };
    }
}

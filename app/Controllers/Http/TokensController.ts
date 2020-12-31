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
            const savedToken = await Token.updateOrCreate({ riderId: user!.rider.id }, { token });
            return { token: savedToken.token };
        }
        if (role === 'driver') {
            await user!.preload('driver');
            const savedToken = await Token.updateOrCreate({ driverId: user!.driver.id }, { token });
            return { token: savedToken.token };
        }
        const savedToken = await Token.updateOrCreate({ userId: user!.id }, { token });
        return { token: savedToken.token };
    }
}

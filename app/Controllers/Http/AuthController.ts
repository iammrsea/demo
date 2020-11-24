import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules } from "@ioc:Adonis/Core/Validator";
import { messages } from "../../../utils";
import User from 'App/Models/User';
import Driver from 'App/Models/Driver';
import Rider from 'App/Models/Rider';


export default class AuthController {

    public async login({ request, auth}: HttpContextContract) {
        try {
            const { password, email, phoneNumber } = await request.validate({
            schema: schema.create({
                password: schema.string({ trim: true }),
                email: schema.string.optional({ trim: true }),
                phoneNumber: schema.string.optional({ trim: true }),
            }),
            messages
        });
            const uids = email || phoneNumber as string;
            const token = await auth.use("api").attempt(uids, password);
            const payload = token.toJSON();
            await token.user.preload('driver');
            await token.user.preload('rider');
            return {
                user_id: token.user.id,
                token: payload.token,
                ...token.user.toJSON(),
            };
        } catch (error) {
            throw error
        }
    }
    public async register({ request, auth }: HttpContextContract) {
        try {
            const { isDriver, phoneNumber, password } = await request.validate({
            schema: schema.create({
                isDriver: schema.boolean.optional(),
                phoneNumber: schema.string({ trim: true }, [
                    rules.unique({ table: 'users', column: "phone_number" }),
                    rules.mobile()
                ]),
                password: schema.string({ trim: true }),
            }),
            messages
        });
        const user = new User();
        user.phoneNumber = phoneNumber;
        user.password = password;

        if (isDriver) {
          const  driver = new Driver();
            user.role = 'driver';
           await user.related('driver').save(driver)
        } else {
            const rider = new Rider();
            user.role = 'rider';
            await user.related('rider').save(rider);
        }
        
        const token = await auth.login(user);
        await user.preload('driver');
        await user.preload('rider');
        const payload = token.toJSON();
        return {
            user_id: token.user.id,
            token: payload.token,
            ...token.user.toJSON(),
        };
        } catch (e) {
            throw e;
      }
    }
     public async logout({ auth }: HttpContextContract) {
        return  auth.logout();
  }
}

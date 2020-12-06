import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UtilService from '../../../services/UtilService'
import { USERS_FOLDER, CONSTANTS } from '../../../utils'
// import User from 'App/Models/User'
import ProfileImage from 'App/Models/ProfileImage'
import UserValidator from '../../../services/validators/UserValidator';
import Rider from 'App/Models/Rider'


export default class RidersController {
    public async index({ request }: HttpContextContract) {
        try {
            let { page, limit } = request.all();
            limit = limit > CONSTANTS.LIMIT || !limit ? CONSTANTS.LIMIT : limit;
            page = page || 1;
            const pagedRider = await Rider.query()
                .preload('profilePicture')
                .preload('userData')
                .paginate(page, limit);

            const { meta, data } = pagedRider.toJSON();
            const riders = data.map(rider => {
                const { email, role, phoneNumber } = rider.userData;
                const serialized = rider.toJSON();
                delete serialized.userData;
                return { ...serialized, role, email, phone_number: phoneNumber }
            })
            return { meta, data: riders }
        } catch (error) {
            throw error
        }
    }
    public async updateRider(ctx: HttpContextContract) {
        try {
            const payload = await UserValidator.validateUser(ctx)
            const { id } = await UtilService.validateIdParam(ctx, 'riders')

            const rider = await Rider.query().where('id', id)
                .preload('profilePicture')
                .preload('userData').firstOrFail();
            const user = rider.userData;

            Object.keys(payload).filter(key => key !== 'profilePicture').forEach(key => {
                if (key === 'phoneNumber' || key === 'email') {
                    user[key] = payload[key] as string;
                } else {
                    rider[key] = payload[key]
                }
            })

            if (!payload.profilePicture) {
                return user.related('rider').updateOrCreate({ id: rider.id }, rider.toJSON());
            }
            const { thumbnailUrl, fileId, url } = await UtilService.savePhoto(
                payload.profilePicture,
                USERS_FOLDER
            )
            const image = new ProfileImage()
            image.url = url
            image.thumbnailUrl = thumbnailUrl
            image.fileId = fileId
            await rider.related('profilePicture').save(image)
            await rider.preload('profilePicture');
            const { email, phoneNumber, role } = rider.userData;
            const updatedRider = rider.toJSON();
            delete updatedRider.userData;
            return { ...updatedRider, email, phone_number: phoneNumber, role };
        } catch (error) {
            throw error
        }
    }
    public async show(ctx: HttpContextContract) {
        try {
            const { id } = await UtilService.validateIdParam(ctx, 'riders');
            const rider = await Rider.query().where('id', id)
                .preload('profilePicture')
                .preload('userData').firstOrFail();
            const { email, phoneNumber, role } = rider.userData;
            const serialized = rider.toJSON();
            delete serialized.userData;
            return { ...serialized, email, phone_number: phoneNumber, role }
        } catch (error) {
            throw error
        }
    }

}

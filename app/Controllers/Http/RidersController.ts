import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UtilService from '../../../services/UtilService'
import { USERS_FOLDER } from '../../../utils'
import User from 'App/Models/User'
import ProfileImage from 'App/Models/ProfileImage'
import UserValidator from '../../../services/validators/UserValidator';


export default class RidersController {
    public async index({ }: HttpContextContract) {
        try {
            return User.query()
                .where('role', 'rider')
                .preload('rider', rider => rider.preload('profilePicture'))
        } catch (error) {
            throw error
        }
    }
    public async updateRider(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const payload = await UserValidator.validateUser(ctx)
            const user = await User.query().where('id', params.id)
                .preload('rider', rider => rider.preload('profilePicture')).firstOrFail();

            Object.keys(payload).filter(key => key !== 'profilePicture').forEach(key => {
                if (key === 'phoneNumber' || key === 'email') {
                    user[key] = payload[key] as string;
                } else {
                    user.rider[key] = payload[key]
                }
            })

            if (!payload.profilePicture) {
                return user.related('rider').updateOrCreate({ id: user.rider.id }, user.rider.toJSON());
            }
            const { thumbnailUrl, fileId, url } = await UtilService.savePhoto(
                payload.profilePicture,
                USERS_FOLDER
            )
            const image = new ProfileImage()
            image.url = url
            image.thumbnailUrl = thumbnailUrl
            image.fileId = fileId
            await user.rider.related('profilePicture').save(image)
            return user
        } catch (error) {
            throw error
        }
    }
    public async show(ctx: HttpContextContract) {
        try {
            const { id } = await UtilService.validateIdParam(ctx, 'users');
            return User.query()
                .where('id', id)
                .where('role', 'rider')
                .preload('rider', rider => {
                    rider.preload('profilePicture')
                })
                .firstOrFail()
        } catch (error) {
            throw error
        }
    }

}

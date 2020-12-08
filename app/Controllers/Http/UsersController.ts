import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import ImagekitProvider from 'App/Services/ImageService'
import UtilService from 'App/Services/UtilService'
import Hash from '@ioc:Adonis/Core/Hash'
import CustomErrorException from 'App/Exceptions/CustomErrorException'
import { messages, USERS_FOLDER } from 'App/Utils'
import User from 'App/Models/User'
import ProfileImage from 'App/Models/ProfileImage'



export default class UsersController {

    public async show(ctx: HttpContextContract) {
        try {
            const { id } = await UtilService.validateIdParam(ctx, 'users');
            return User.query()
                .where('id', id)
                .firstOrFail()
        } catch (error) {
            throw error
        }
    }
    public async changePhoto({ request, params }: HttpContextContract) {
        try {
            const { profilePicture } = await request.validate({
                schema: schema.create({
                    profilePicture: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                messages
            })
            const { url, thumbnailUrl, fileId } = await UtilService.savePhoto(
                profilePicture,
                USERS_FOLDER
            )
            const user = await User.findOrFail(params.id)
            switch (user!.role) {
                case 'driver':
                    return this.changeDriverPhoto(user, url, fileId, thumbnailUrl)
                case 'rider':
                    return this.changeRiderPhoto(user, url, fileId, thumbnailUrl)
                default:
                    return
            }
        } catch (error) {
            throw error
        }
    }
    public async changePassword({ request, auth }: HttpContextContract) {
        try {
            const payload = await request.validate({
                schema: schema.create({
                    newPassword: schema.string({ trim: true }),
                    oldPassword: schema.string({ trim: true })
                })
            })
            const user = auth.user
            const password = user!.$attributes['password']
            const isOldPassword = await Hash.verify(password, payload.oldPassword)
            if (!isOldPassword) {
                throw new CustomErrorException('Wrong credentials', 400)
            }
            user!.password = payload.newPassword
            await user!.save()
            //Log user in with their new password;
            const token = await auth
                .use('api')
                .attempt(user!.email, payload.newPassword)
            const tokenPayload = token.toJSON()
            await token.user.preload('driver')
            await token.user.preload('rider')
            return {
                user_id: token.user.id,
                token: tokenPayload.token,
                ...token.user.toJSON()
            }
        } catch (error) {
            throw error
        }
    }

    public async destroy({ params }: HttpContextContract) {
        try {
            const user = await User.findByOrFail('id', params.id)
            return user.delete()
        } catch (error) {
            throw error
        }
    }
    private async changeDriverPhoto(
        user: User,
        url: string,
        fileId: string,
        thumbnailUrl: string
    ) {
        try {
            await user!.preload('driver', driver => driver.preload('profilePicture'))
            if (user!.driver.profilePicture) {
                const { fileId: oldId } = user!.driver.profilePicture
                user!.driver.profilePicture.url = url
                user!.driver.profilePicture.fileId = fileId
                user!.driver.profilePicture.thumbnailUrl = thumbnailUrl
                await user!.driver.profilePicture.save()
                await ImagekitProvider.deleteImage(oldId)
                return user!.driver.profilePicture
            }
            const image = new ProfileImage()
            image.url = url
            image.thumbnailUrl = thumbnailUrl
            image.fileId = fileId
            const { driver } = user!
            await image.related('driver').associate(driver)
            return user!.driver.profilePicture
        } catch (error) {
            throw error
        }
    }
    private async changeRiderPhoto(
        user: User,
        url: string,
        fileId: string,
        thumbnailUrl: string
    ) {
        try {
            await user!.preload('rider', rider => rider.preload('profilePicture'))
            if (user!.rider.profilePicture) {
                const { fileId: oldId } = user!.rider.profilePicture
                user!.rider.profilePicture.url = url
                user!.rider.profilePicture.fileId = fileId
                user!.rider.profilePicture.thumbnailUrl = thumbnailUrl
                await user!.rider.profilePicture.save()
                await ImagekitProvider.deleteImage(oldId)
                return user!.rider.profilePicture
            }
            const image = new ProfileImage()
            image.url = url
            image.thumbnailUrl = thumbnailUrl
            image.fileId = fileId
            const { rider } = user!
            await image.related('rider').associate(rider)
            return user!.rider.profilePicture
        } catch (error) {
            throw error
        }
    }
}

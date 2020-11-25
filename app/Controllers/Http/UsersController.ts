import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import User from 'App/Models/User';
import ImagekitProvider from '../../../services/ImageService'
import UtilService from '../../../services/UtilService'
import Hash from '@ioc:Adonis/Core/Hash'
import CustomErrorException from 'App/Exceptions/CustomErrorException'
import { messages, USERS_FOLDER, DRIVERS_DOCUMENT_FOLDER } from '../../../utils'
import User from 'App/Models/User'
import ProfileImage from 'App/Models/ProfileImage'
import DriverService from '../../../services/DriverService'


export default class UsersController {
    public async index({ }: HttpContextContract) {
        try {
            return User.query()
                .preload('driver', driver => driver.preload('profilePicture'))
                .preload('rider', rider => rider.preload('profilePicture'))
        } catch (error) {
            throw error
        }
    }
    public async updateRider(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const payload = await this.validateUser(ctx)
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
    public async updateDriver(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const payload = await this.validateDriver(ctx)
            const user = await User.query().where('id', params.id)
                .preload('driver').firstOrFail();

            Object.keys(payload).forEach(key => {
                if (key === 'phoneNumber' || key === 'email') {
                    user[key] = payload[key] as string;
                } else {
                    user.driver[key] = payload[key]
                }
            })
            return user.related('driver').updateOrCreate({ id: user.driver.id }, user.driver.toJSON())
        } catch (error) {
            throw error
        }
    }
    public async show({ params }: HttpContextContract) {
        try {
            return User.query()
                .where('id', params.id)
                .preload('driver', driver => {
                    driver.preload('address')
                    driver.preload('documents')
                    driver.preload('profilePicture')
                    driver.preload('vehicle')
                })
                .preload('rider', rider => {
                    rider.preload('profilePicture')
                })
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
    public async addPersonalData(ctx: HttpContextContract) {
        try {
            const {
                params: { id }
            } = ctx
            const payload = await this.validatePersonalData(ctx);
            const { birthCertificate, nationalID, utilityBill, profilePicture, driverLicense } = payload;
            const user = await User.query()
                .where('id', id)
                .preload('driver')
                .firstOrFail()

            //Save documents;
            const birth = await this.saveDoc(birthCertificate.photo);
            const nationalId = await this.saveDoc(nationalID.photo);
            const utility = await this.saveDoc(utilityBill.photo);
            const license = await this.saveDoc(driverLicense.photo);

            const documents = await user.driver.related('documents').createMany([
                { ...birth, documentType: 'birth_certificate' },
                { ...nationalId, documentType: 'national_id' },
                { ...utility, documentType: 'utility_bill' },
                { ...license, documentType: 'driver_license' },
            ])

            //Save profile picture
            const profile = await UtilService.savePhoto(profilePicture.photo, USERS_FOLDER)
            await user.driver.related('profilePicture').updateOrCreate({}, profile)

            return documents;
        } catch (error) {
            throw error
        }
    }
    private async saveDoc(photo: any) {
        return UtilService.savePhoto(photo, DRIVERS_DOCUMENT_FOLDER)
    }
    public async addVehicleData(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const vehicle = await this.validateVehicle(ctx)
            const user = await User.query().where('id', params.id)
                .preload('driver', driver => driver.preload('vehicle')).firstOrFail();
            await user.driver.related('vehicle').updateOrCreate({}, vehicle)
            return user
        } catch (error) {
            throw error
        }
    }
    public async addAddress(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const address = await this.validateAddress(ctx);
            const user = await User.query().where('id', params.id)
                .preload('driver', driver => driver.preload('address')).firstOrFail();
            await user.driver.related('address').updateOrCreate({}, address)
            return user
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
    public async online(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            const location = await this.validateOnlineData(ctx);
            return DriverService.goOnline(user!, location)
        } catch (error) {
            throw error
        }
    }
    public async offline(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            return DriverService.goOffline(user!)
        } catch (error) {
            throw error
        }
    }
    public async tricyclesOnline() {
        try {
            return DriverService.tricycleOnline();
        } catch (error) {
            throw error
        }
    }
    public async tricyclesIntransit() {
        try {
            return DriverService.tricycleIntransit()
        } catch (error) {
            throw error
        }
    }
    public async bikesOnline() {
        try {
            return DriverService.bikeOnline();
        } catch (error) {
            throw error
        }
    }
    public async bikesIntransit() {
        try {
            return DriverService.bikeIntransit()
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
    private validatePersonalData(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                birthCertificate: schema.object().members({
                    photo: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                profilePicture: schema.object().members({
                    photo: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                utilityBill: schema.object().members({
                    photo: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                driverLicense: schema.object().members({
                    photo: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                nationalID: schema.object().members({
                    photo: schema.file({
                        size: '2mb',
                        extnames: ['jpg', 'png', 'jpeg']
                    })
                }),
                // personalData: schema
                //     .array([rules.maxLength(5), rules.minLength(5)])
                //     .members(
                //         schema.object().members({
                //             document: schema.file({
                //                 size: '2mb',
                //                 extnames: ['jpg', 'png', 'jpeg']
                //             }),
                //             documentType: schema.enum([
                //                 'profile_picture',
                //                 'birth_certificate',
                //                 'national_id',
                //                 'driver_license',
                //                 'utility_bill'
                //             ])
                //         })
                //     )
            }),
            messages
        })
    }
    private validateDriver(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                email: schema.string.optional({ trim: true }, [
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                phoneNumber: schema.string.optional({ trim: true }, [
                    rules.mobile(),
                    rules.unique({ table: 'users', column: 'phone_number' })
                ]),
                fullName: schema.string.optional({ trim: true }),
                address: schema.string.optional({ trim: true }),
                bvn: schema.string.optional({ trim: true }),
            }),
            messages
        })
    }
    private validateUser(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                email: schema.string.optional({ trim: true }, [
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                phoneNumber: schema.string.optional({ trim: true }, [
                    rules.mobile(),
                    rules.unique({ table: 'users', column: 'phone_number' })
                ]),
                firstName: schema.string.optional({ trim: true }),
                lastName: schema.string.optional({ trim: true }),
                fullName: schema.string.optional({ trim: true }),
                address: schema.string.optional({ trim: true }),
                bvn: schema.string.optional({ trim: true }),
                profilePicture: schema.file.optional({
                    size: '2mb',
                    extnames: ['jpg', 'png', 'jpeg']
                })
            }),
            messages
        })
    }
    private validateVehicle(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                vehicleType: schema.enum(['bike', 'keke']),
                modelNumber: schema.string({ trim: true }),
                plateNumber: schema.string({ trim: true }),
                color: schema.string.optional({ trim: true })
            }),
            messages
        })
    }
    private validateAddress(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                state: schema.string({ trim: true }),
                lga: schema.string({ trim: true }),
                homeAddress: schema.string({ trim: true })
            }),
            messages
        })
    }
    private validateOnlineData(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                latitude: schema.string({ trim: true }),
                longitude: schema.string({ trim: true }),
                address: schema.string.optional({ trim: true }),
            }),
            messages
        })
    }
}

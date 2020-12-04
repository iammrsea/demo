import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { messages } from "../../utils";

class UserValidator {

    public validateUser(ctx: HttpContextContract) {
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
    public validatePersonalData(ctx: HttpContextContract) {
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

    public validateDriver(ctx: HttpContextContract) {
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
    public validateVehicle(ctx: HttpContextContract) {
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
    public validateAddress(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                state: schema.string({ trim: true }),
                lga: schema.string({ trim: true }),
                homeAddress: schema.string({ trim: true })
            }),
            messages
        })
    }
    public validateOnlineData(ctx: HttpContextContract) {
        return ctx.request.validate({
            schema: schema.create({
                latitude: schema.number(),
                longitude: schema.number(),
                address: schema.string.optional({ trim: true }),
            }),
            messages
        })
    }

}

export default new UserValidator();
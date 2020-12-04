import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UtilService from '../../../services/UtilService'
import { USERS_FOLDER, DRIVERS_DOCUMENT_FOLDER } from '../../../utils'
import User from 'App/Models/User'
import DriverService from '../../../services/DriverService'
import UserValidator from '../../../services/validators/UserValidator'
import Vehicle from 'App/Models/Vehicle'

export default class DriversController {
    public async index({ }: HttpContextContract) {
        try {
            return User.query()
                .where('role', 'driver')
                .preload('driver', driver => driver.preload('profilePicture'))
        } catch (error) {
            throw error
        }
    }
    public async updateDriver(ctx: HttpContextContract) {
        try {
            const { params } = ctx
            const payload = await UserValidator.validateDriver(ctx)
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
    public async show(ctx: HttpContextContract) {
        try {

            const { id } = await UtilService.validateIdParam(ctx, 'users');
            return User.query()
                .where('id', id)
                .where('role', 'driver')
                .preload('driver', driver => {
                    driver.preload('address')
                    driver.preload('documents')
                    driver.preload('profilePicture')
                    driver.preload('vehicle')
                })
                .firstOrFail()
        } catch (error) {
            throw error
        }
    }
    public async addPersonalData(ctx: HttpContextContract) {
        try {
            const {
                params: { id }
            } = ctx
            const payload = await UserValidator.validatePersonalData(ctx);
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
            const vehicle = await UserValidator.validateVehicle(ctx)
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
            const address = await UserValidator.validateAddress(ctx);
            const user = await User.query().where('id', params.id)
                .preload('driver', driver => driver.preload('address')).firstOrFail();
            await user.driver.related('address').updateOrCreate({}, address)
            return user
        } catch (error) {
            throw error
        }
    }
    public async switchOn(ctx: HttpContextContract) {
        try {
            const { auth } = ctx;
            const user = auth.user;
            const location = await UserValidator.validateOnlineData(ctx);
            return DriverService.goOnline(user!, location)
        } catch (error) {
            throw error
        }
    }
    public async switchOff(ctx: HttpContextContract) {
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
    public async bikes() {
        try {
            return Vehicle.query()
                .where('vehicle_type', 'bike')
                .preload('owner', owner => {
                    owner.preload('profilePicture');
                    owner.preload('userData')
                });

        } catch (error) {
            throw error
        }
    }
    public async tricycles() {
        try {
            return Vehicle.query()
                .where('vehicle_type', 'keke')
                .preload('owner', owner => {
                    owner.preload('profilePicture');
                    owner.preload('userData')
                });

        } catch (error) {
            throw error
        }
    }
    public async vehicles() {
        try {
            return Vehicle.query()
                .preload('owner', owner => {
                    owner.preload('profilePicture');
                    owner.preload('userData')
                });

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

}

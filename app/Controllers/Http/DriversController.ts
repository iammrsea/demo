import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { USERS_FOLDER, DRIVERS_DOCUMENT_FOLDER, CONSTANTS } from "App/Utils"
import DriverService from 'App/Services/DriverService'
import UtilService from 'App/Services/UtilService'
import UserValidator from 'App/Services/validators/UserValidator'
import Vehicle from 'App/Models/Vehicle'
import Driver from 'App/Models/Driver'

export default class DriversController {
    public async index({ request }: HttpContextContract) {
        let { page, limit } = request.all();
        limit = limit > CONSTANTS.LIMIT || !limit ? CONSTANTS.LIMIT : limit;
        page = page || 1;
        const pageedDrivers = await Driver.query()
            .preload('profilePicture')
            .preload('address')
            .preload('userData')
            .preload('vehicle')
            .paginate(page, limit);
        const { meta, data } = pageedDrivers.toJSON();
        const drivers = data.map(driver => {
            const { email, role, phoneNumber } = driver.userData;
            const serialized = driver.toJSON();
            delete serialized.userData;
            return { ...serialized, role, email, phone_number: phoneNumber }
        })
        return { meta, data: drivers }
    }
    public async updateDriver(ctx: HttpContextContract) {

        const { id } = await UtilService.validateIdParam(ctx, 'drivers');
        const payload = await UserValidator.validateDriver(ctx)

        const driver = await Driver.query().where('id', id)
            .preload('userData').firstOrFail();
        const user = driver.userData;

        Object.keys(payload).forEach(key => {
            if (key === 'phoneNumber' || key === 'email') {
                user[key] = payload[key] as string;
            } else {
                driver[key] = payload[key]
            }
        })
        await user.related('driver').updateOrCreate({ id: driver.id }, driver.toJSON())
        const { email, phoneNumber, role } = user;
        const updatedDriver = driver.toJSON();
        delete updatedDriver.userData
        return { ...updatedDriver, email, phone_number: phoneNumber, role }

    }
    public async show(ctx: HttpContextContract) {
        const { id } = await UtilService.validateIdParam(ctx, 'drivers');
        const driver = await Driver.query().where('id', id)
            .preload('address')
            .preload('documents')
            .preload('profilePicture')
            .preload('vehicle')
            .preload('userData').firstOrFail();
        const serialized = driver.toJSON();
        const userData = serialized.userData;
        delete serialized.userData;
        return { ...serialized, email: userData.email, phone_number: userData.phone_number, role: userData.role }
    }
    public async addPersonalData(ctx: HttpContextContract) {

        const { id } = await UtilService.validateIdParam(ctx, 'drivers');
        const payload = await UserValidator.validatePersonalData(ctx);
        const { birthCertificate, nationalID, utilityBill, profilePicture, driverLicense } = payload;
        const driver = await Driver.query()
            .where('id', id)
            .firstOrFail()

        //Save documents;
        const birth = await this.saveDoc(birthCertificate.photo);
        const nationalId = await this.saveDoc(nationalID.photo);
        const utility = await this.saveDoc(utilityBill.photo);
        const license = await this.saveDoc(driverLicense.photo);

        await driver.related('documents').createMany([
            { ...birth, documentType: 'birth_certificate' },
            { ...nationalId, documentType: 'national_id' },
            { ...utility, documentType: 'utility_bill' },
            { ...license, documentType: 'driver_license' },
        ])

        //Save profile picture
        const profile = await UtilService.savePhoto(profilePicture.photo, USERS_FOLDER)
        await driver.related('profilePicture').updateOrCreate({}, profile)
        await driver.preload('documents');
        await driver.preload('profilePicture')
        return driver;
    }
    private saveDoc(photo: any) {
        return UtilService.savePhoto(photo, DRIVERS_DOCUMENT_FOLDER)
    }
    public async addVehicleData(ctx: HttpContextContract) {

        const { id } = await UtilService.validateIdParam(ctx, 'drivers');
        const vehicle = await UserValidator.validateVehicle(ctx)

        const driver = await Driver.query().where('id', id)
            .preload('vehicle').firstOrFail();
        return driver.related('vehicle').updateOrCreate({}, vehicle)


    }
    public async addAddress(ctx: HttpContextContract) {
        const { id } = await UtilService.validateIdParam(ctx, 'drivers');
        const address = await UserValidator.validateAddress(ctx);
        const driver = await Driver.query().where('id', id)
            .preload('address').firstOrFail();
        return driver.related('address').updateOrCreate({}, address)

    }
    public async switchOn(ctx: HttpContextContract) {

        const { auth } = ctx;
        const user = auth.user;
        const location = await UserValidator.validateOnlineData(ctx);
        return DriverService.goOnline(user!, location)
    }
    public async switchOff(ctx: HttpContextContract) {

        const { auth } = ctx;
        const user = auth.user;
        return DriverService.goOffline(user!)

    }
    public async tricyclesOnline() {

        return DriverService.tricycleOnline();

    }
    public async tricyclesIntransit() {
        return DriverService.tricycleIntransit()
    }
    public async bikes() {
        return Vehicle.query()
            .where('vehicle_type', 'bike')
            .preload('owner', owner => {
                owner.preload('profilePicture');
                owner.preload('userData')
            });
    }
    public async tricycles() {
        return Vehicle.query()
            .where('vehicle_type', 'keke')
            .preload('owner', owner => {
                owner.preload('profilePicture');
                owner.preload('userData')
            });
    }
    public async vehicles() {
        return Vehicle.query()
            .preload('owner', owner => {
                owner.preload('profilePicture');
                owner.preload('userData')
            });
    }
    public async bikesOnline() {
        return DriverService.bikeOnline();
    }
    public async bikesIntransit() {
        return DriverService.bikeIntransit()
    }

}

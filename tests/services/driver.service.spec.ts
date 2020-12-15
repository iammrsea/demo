import test from 'japa';
import Database from '@ioc:Adonis/Lucid/Database';
import { nanoid } from 'nanoid';
// import UtilService from 'App/Services/UtilService';
import User from 'App/Models/User';
import Vehicle from 'App/Models/Vehicle';
import DriverService from 'App/Services/DriverService';


test.group('driver service unit tests', (group) => {
    group.before(async () => {
        await Database.beginGlobalTransaction();
    });
    group.after(async () => {
        await Database.rollbackGlobalTransaction();
    })
    let user;

    test('driver goes online with bike', async (assert) => {
        user = new User();
        user.email = nanoid() + '@gmail.com';
        user.phoneNumber = nanoid();
        user.password = nanoid();

        const driver = await user.related('driver').create({ verified: false, suspended: false, bvn: nanoid(), });
        const vehicle = new Vehicle();
        vehicle.vehicleType = 'bike';
        vehicle.modelNumber = nanoid();
        vehicle.plateNumber = nanoid();
        vehicle.driverId = driver.id;
        await vehicle.save();

        const location = {
            latitude: 40.7676919,
            longitude: -73.98513559999999
        }

        const { message, data } = await DriverService.goOnline(user, location);
        assert.equal(message, 'Vehicle online');
        assert.equal(data.vehicle_type, 'bike');
        assert.isTrue(data.is_online);
    })
    test('driver goes online with keke', async (assert) => {
        const user = new User();
        user.email = nanoid() + '@gmail.com';
        user.phoneNumber = nanoid();
        user.password = nanoid();

        const driver = await user.related('driver').create({ verified: false, suspended: false, bvn: nanoid(), });
        const vehicle = new Vehicle();
        vehicle.vehicleType = 'keke';
        vehicle.modelNumber = nanoid();
        vehicle.plateNumber = nanoid();
        vehicle.driverId = driver.id;
        await vehicle.save();

        const location = {
            latitude: 40.7676919,
            longitude: -73.98513559999999
        }

        const { message, data } = await DriverService.goOnline(user, location);
        assert.equal(message, 'Vehicle online');
        assert.equal(data.vehicle_type, 'keke');
        assert.isTrue(data.is_online);
    })
    test('driver goes offline', async (assert) => {
        const { message, data } = await DriverService.goOffline(user);
        assert.equal(message, 'Vehicle offline');
        assert.isFalse(data.is_online);
    })
})
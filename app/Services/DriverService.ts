import OnlineBike from "App/Models/OnlineBike";
import OnlineTricycle from "App/Models/OnlineTricycle";
import User from "App/Models/User";

class DriverService {

    public async goOnline(user: User, location: any) {
        try {
            await user.preload('driver', driver => {
                driver.preload('vehicle')
            });
            const { driver } = user;
            switch (user.driver.vehicle.vehicleType) {
                case 'bike':
                    const bike = await OnlineBike.updateOrCreate({ driverId: driver.id }, {
                        inTransit: false,
                        driverId: driver.id,
                        isOnline: true
                    });
                    await bike.related('geolocation').updateOrCreate({}, location);
                    return { status: true, message: 'Vehicle online', data: { is_online: bike.isOnline, vehicle_type: 'bike' } }
                case 'keke':
                    const tricycle = await OnlineTricycle.updateOrCreate({ driverId: driver.id }, {
                        inTransit: false,
                        driverId: driver.id,
                        isOnline: true,
                        availableSeats: 4
                    })
                    await tricycle.related('geolocation').updateOrCreate({}, location);
                    return { status: true, message: 'Vehicle online', data: { is_online: tricycle.isOnline, vehicle_type: 'keke' } }
                default:
                    return { status: false, message: 'Error occurred', data: {} };
            }
        } catch (error) {
            throw error;
        }
    }
    public async goOffline(user: User) {
        try {
            await user.preload('driver', driver => driver.preload('vehicle'));
            switch (user.driver.vehicle.vehicleType) {
                case 'bike':
                    const bike = await OnlineBike.findByOrFail('driver_id', user.driver.id);
                    bike.isOnline = false;
                    await bike.save();
                    return { status: true, message: 'Vehicle offline', data: { is_online: bike.isOnline, vehicle_type: 'bike' } }
                case 'keke':
                    const tricycle = await OnlineTricycle.findByOrFail('driver_id', user.driver.id);
                    tricycle.isOnline = false;
                    await tricycle.save();
                    return { status: true, message: 'Vehicle offline', data: { is_online: tricycle.isOnline, vehicle_type: 'keke' } }
                default:
                    return { status: false, message: 'Error occurred', data: {} };;
            }

        } catch (error) {
            throw error
        }
    }
    public tricycleOnline() {
        return this.tricycles();
    }
    public tricycleIntransit() {
        return this.tricycles(true)
    }
    public bikeOnline() {
        return this.bikes()
    }
    public bikeIntransit() {
        return this.bikes(true)
    }
    private bikes(inTransit?: boolean) {
        const query = OnlineBike.query()
            .where('is_online', true);
        if (inTransit) {
            query.where('in_transit', inTransit);
        }
        return query.preload('driver', driver => driver.preload('vehicle'))
            .preload('geolocation')
            .preload('trip');
    }
    private tricycles(inTransit?: boolean) {
        const query = OnlineTricycle.query()
            .where('is_online', true);
        if (inTransit) {
            query.where('in_transit', inTransit);
        }
        return query.preload('driver', driver => driver.preload('vehicle'))
            .preload('geolocation')
            .preload('trip');
    }
}

export default new DriverService();
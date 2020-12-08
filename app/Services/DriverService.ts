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
                    return bike.related('geolocation').updateOrCreate({}, location);
                case 'keke':
                    const tricycle = await OnlineTricycle.updateOrCreate({ driverId: driver.id }, {
                        inTransit: false,
                        driverId: driver.id,
                        isOnline: true,
                        availableSeats: 4
                    })
                    return tricycle.related('geolocation').updateOrCreate({}, location);
                default:
                    return;
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
                    return bike.save();
                case 'keke':
                    const tricycle = await OnlineTricycle.findByOrFail('driver_id', user.driver.id);
                    tricycle.isOnline = false;
                    return tricycle.save();
                default:
                    return;
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
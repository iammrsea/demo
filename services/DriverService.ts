import OnlineBike from "App/Models/OnlineBike";
import OnlineTricycle from "App/Models/OnlineTricycle";
import User from "App/Models/User";
import Geolocation from "Contracts/Geolocation";

class DriverService {

    public async goOnline(user: User, location: Geolocation) {
        try {
            await user.preload('driver', driver => {
                driver.preload('vehicle')
            });
            switch (user.driver.vehicle.vehicleType) {
                case 'bike':
                    const bike = new OnlineBike();
                    bike.driverId = user.driver.id;
                    bike.inTransit = false;
                    return bike.related('geolocation').create(location);
                case 'keke':
                    const tricycle = new OnlineTricycle();
                    tricycle.driverId = user.driver.id;
                    tricycle.inTransit = false;
                    tricycle.availableSeats = 4;
                    return tricycle.related('geolocation').create(location);
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
                    return bike.delete();
                case 'keke':
                    const tricycle = await OnlineTricycle.findByOrFail('driver_id', user.driver.id);
                    return tricycle.delete();
                default:
                    return;
            }

        } catch (error) {
            throw error
        }
    }
    public tricycleOnline() {
        return OnlineTricycle.query()
            .preload('driver')
            .preload('trip')
            .preload('geolocation');
    }
    public tricycleIntransit() {
        return OnlineTricycle.query()
            .where('in_transit', true)
            .preload('driver')
            .preload('trip')
            .preload('geolocation')
    }
    public bikeOnline() {
        return OnlineBike.query()
            .preload('driver')
            .preload('geolocation')
            .preload('trip');
    }
    public bikeIntransit() {
        return OnlineBike.query()
            .where('in_transit', true)
            .preload('driver')
            .preload('geolocation')
            .preload('trip');
    }
}

export default new DriverService();
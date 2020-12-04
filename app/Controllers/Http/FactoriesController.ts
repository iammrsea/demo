// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userFactory } from "../../../database/factories";

export default class FactoriesController {
    public async bikeDrivers() {
        try {
            return userFactory('driver', 'bike')
                .with('driver', 1, driver => {
                    driver.with('address', 1);
                    driver.with('vehicle', 1);
                })
                .createMany(10)
        } catch (error) {
            throw error
        }
    }
    public async tricycleDrivers() {
        try {
            return userFactory('driver', 'keke')
                .with('driver', 1, driver => {
                    driver.with('address', 1);
                    driver.with('vehicle', 1);
                })
                .createMany(10)
        } catch (error) {
            throw error
        }
    }
    public async riders() {
        try {
            return userFactory('rider', '')
                .with('rider', 1)
                .createMany(5)
        } catch (error) {
            throw error;
        }
    }
}

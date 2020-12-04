import Factory from '@ioc:Adonis/Lucid/Factory'
import Address from 'App/Models/Address'
import Driver from 'App/Models/Driver'
import Rider from 'App/Models/Rider'
import User from 'App/Models/User'
import Vehicle from 'App/Models/Vehicle'

const driverFactory = (vehicleType: string) => Factory.define(Driver, ({ faker }) => {
    return {
        fullName: faker.name.firstName() + '' + faker.name.lastName(),
        bvn: '1234569873645'
    }
}).relation('address', () => addressFactory())
    .relation('vehicle', () => vehicleFactory(vehicleType))
    .build()

const addressFactory = () => Factory.define(Address, ({ faker }) => {
    return {
        state: faker.address.state(),
        lga: faker.address.county(),
        homeAddress: faker.address.streetAddress(true)
    }
}).build();
const vehicleFactory = (vehicleType: string) => Factory.define(Vehicle, ({ faker }) => {
    return {
        vehicleType,
        modelNumber: faker.vehicle.model(),
        plateNumber: faker.vehicle.vin(),
        color: faker.vehicle.color()
    }
}).build()
const riderFactory = () => Factory.define(Rider, ({ faker }) => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        bvn: '1234569873645',
        address: faker.address.city()
    }
}).build()
export const userFactory = (role, vehicleType: string) => Factory.define(User, ({ faker }) => {
    return {
        phoneNumber: faker.phone.phoneNumber(),
        password: 'password',
        email: faker.internet.email(),
        role
    }
}).relation('driver', () => driverFactory(vehicleType))
    .relation('rider', () => riderFactory())
    .build()
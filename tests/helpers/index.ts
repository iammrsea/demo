import Driver from 'App/Models/Driver';
import Rider from 'App/Models/Rider';
import User from 'App/Models/User';
import { nanoid } from 'nanoid';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/api/v1/`;

export const login = async (user: any) => {
    const { body: { token } } = await supertest(BASE_URL).post('auth/login')
        .send({ ...user })
        .accept('application/json')
        .expect(200);
    return token;
}
export const createMessage = (text: string, token: string) => {
    return supertest(BASE_URL).post('messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
            text
        })
        .accept('application/json')
        .expect(200);
}
export const createRider = async () => {
    const user = new User();
    user.email = nanoid() + '@gmail.com';
    user.password = 'password';
    user.phoneNumber = nanoid();
    user.role = 'rider';

    const rider = new Rider();
    rider.firstName = 'test_firstname';
    rider.lastName = 'test_lastname';
    await user.related('rider').save(rider);
    await user.preload('rider')
    const { role, email, rider: { id: riderId } } = user;
    return { email, role, riderId, password: 'password' };
}
export const createDriver = async () => {
    const user = new User();
    user.email = nanoid() + '@gmail.com';
    user.password = 'password';
    user.phoneNumber = nanoid();
    user.role = 'driver';

    const driver = new Driver();
    driver.firstName = 'test_firstname';
    driver.lastName = 'test_lastname';
    await user.related('driver').save(driver);
    await user.preload('driver')
    const { role, email, driver: { id: driverId } } = user;
    return { email, role, driverId, password: 'password' };
}
export const createAdmin = async () => {
    const user = new User();
    user.email = nanoid() + '@gmail.com';
    user.password = 'password';
    user.phoneNumber = nanoid();
    user.role = 'admin';
    await user.save();
    return { email: user.email, role: user.role, password: 'password' };
}
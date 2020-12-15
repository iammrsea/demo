import supertest from 'supertest';
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

export const login = async (user: any) => {
    const { body: { token } } = await supertest(BASE_URL).post('/api/v1/auth/login')
        .send({ ...user })
        .accept('application/json')
        .expect(200);
    return token;
}
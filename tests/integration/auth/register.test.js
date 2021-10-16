
const request = require('supertest');
const { User } = require('../../../Model/users');

let server;
const route = '/api/auth/'

describe(`${route}`, () =>{
    beforeEach(async () =>{
        server = require('../../../app');

        user = new User({
            userName: 'Leebang',
            email: 'lee@gmail.com',
            password: 'password1',
            confirmPassword: 'password1'
        });
    });

    afterEach(async () => {
        server.close()
        await User.remove({});
    });

    const exec = async () => {
        return await request(server)
        .post(`${route}/register`)
        .send(user)
    };

    describe('Register', () => {
        it('should return 200 if user details are valid', async ()=> {
            user = {
                userName: 'Leonard',
                email: 'leo@gmail.com',
                password: 'Password1#',
                confirmPassword: 'Password1#'   
            };
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return 400 if user already exists', async () => {
            await user.save();
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if passwords do not match', async () => {
            user.password != user.confirmPassword;
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });
});

const {User} = require('../../Model/users');
const {Note} = require('../../Model/notes');
const request = require("supertest");



describe("auth middleware", () => {
    beforeEach(() => {
        server = require("../../app");
    });
    afterEach(async () => {
        await server.close();
    });
    let token;
    const exec = () => {
        return request(server)
        .post("/api/notes")
        .set('x-auth-token', token)
        .send({
            title: "sleeping in the afternoon",
            author: "chisom",
            body: "Jesus is lord",
            isStarred: "true",
        });
    };

    beforeEach( ()=>{
        token = new User().generateAuthToken();
    })
    it('should return 401 if no  token is provided', async()=>{
        token = ''

        const res = await exec();
        expect(res.status).toBe(401)
    });
    it('should return 400 if invalid token is provided', async()=>{
        token = 'ab'

        const res = await exec();
        expect(res.status).toBe(400)
    });
});

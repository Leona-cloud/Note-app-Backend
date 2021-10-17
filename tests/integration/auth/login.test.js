const request = require("supertest");
const bcrypt = require("bcrypt");
const { User } = require("../../../Model/users");

let server;
let user;

const route = "/api/auth/";

describe(`${route}`, () => {
  beforeEach(async () => {
    server = require("../../../app");

    user = new User({
      userName: "Leebang",
      email: "lee@gmail.com",
      password: "Password1#",
      confirmPassword: "Password1#",
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  const exec = async () => {
    return await request(server)
      .post(`${route}/login`)
      .send({ email: user.email, password: 'Password1#' });
  };

  describe("Login", () => {
    it("should return 200 if user is valid", async () => {
      await user.save();
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it('should return 400 if user does not exists', async () => {
      const res = await exec();
      expect(res.status).toBe(400);
  });

  it('should return 400 if password is invalid', async () => {
    password = 'eeee';

    const res = await exec();
    expect(res.status).toBe(400);
});
  });
});

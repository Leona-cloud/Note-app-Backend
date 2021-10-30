const {User} = require('../../../Model/users');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');

describe("user.generateAuthToken", () => {
    it('should return a valid json web token', async () => {
        const payload = { _id : new mongoose.Types.ObjectId()}
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.notes_jwtPrivateKey);
        expect(decoded).toMatchObject(payload)
    });
  
});

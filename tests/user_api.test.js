const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
    username: "ajay",
    name: "Ajay Dangi",
    passwordHash: "akd1234"
}

beforeEach(async ()=>{
    await User.deleteMany()
    let userObject = new User(initialUser)
    await userObject.save()
})

test('unique user not created', async ()=>{
    const newUser = {
        username: "ajay",
        name: "Abhay",
        password: "abc12"
    }
    await api.post('/api/users').send(newUser).expect(500)
})
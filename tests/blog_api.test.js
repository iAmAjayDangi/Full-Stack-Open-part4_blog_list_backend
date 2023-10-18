const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 6
    }
]

const initialUser = {
    username: "ajay1",
    name: "Ajay",
    password: "akd1234"
}

beforeAll(async () =>{
    await api.post('/api/users').send(initialUser)
})


beforeEach(async () =>{
    await Blog.deleteMany()
    const loginResponse = await api.post('/api/login').send({username: "ajay1", password: "akd1234"})
    const token = "bearer " + loginResponse._body.token
    await api.post('/api/blogs').send(initialBlogs[0]).set({Authorization: token})
    await api.post('/api/blogs').send(initialBlogs[1]).set({Authorization: token})
    await api.post('/api/blogs').send(initialBlogs[2]).set({Authorization: token})
})

test('blogs are returned as json', async ()=>{
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () =>{
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('unique identifier propery', async () =>{
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
}, 100000)



test('valid post', async () =>{

    const loginResponse = await api.post('/api/login').send({username: "ajay1", password: "akd1234"})
    const token = "bearer " + loginResponse._body.token

    const blogObject = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    }

    await api.post('/api/blogs').send(blogObject).set({Authorization: token}).expect(201).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length+1)
    expect(contents).toContain('TDD harms architecture')

})

test('missing likes property', async ()=>{

    const loginResponse = await api.post('/api/login').send({username: "ajay1", password: "akd1234"})
    const token = "bearer " + loginResponse._body.token

    const blogObject ={
        title: "test like",
        author: "Ajay Dangi",
        url: "http://localhost:3001"
    }

    await api.post('/api/blogs').send(blogObject).set({Authorization: token}).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const content = response.body.filter(r => r.title === 'test like')
    expect(content[0].likes).toBe(0)

})

test('missing url or title', async ()=>{

    const loginResponse = await api.post('/api/login').send({username: "ajay1", password: "akd1234"})
    const token = "bearer " + loginResponse._body.token

    const blogObject ={
        title: "test missing url or title",
        author: "Abhay Dangi"
    }

    await api.post('/api/blogs').set({Authorization: token}).send(blogObject).expect(400)
})

test('delete blog post', async() =>{

    const loginResponse = await api.post('/api/login').send({username: "ajay1", password: "akd1234"})
    const token = "bearer " + loginResponse._body.token
    
    const response = await api.get('/api/blogs')
    await api.delete(`/api/blogs/${response.body[0].id}`).set({Authorization: token}).expect(204)
    const newResponse = await api.get('/api/blogs')
    expect(newResponse.body).toHaveLength(initialBlogs.length-1)
})

test('update blog', async() =>{
    const response = await api.get('/api/blogs')

    const blogObject = response.body[0]
    blogObject.likes = 10

    await api.put(`/api/blogs/${blogObject.id}`).send(blogObject)

    const newResponse = await api.get('/api/blogs')
    expect(newResponse.body[0].likes).toBe(blogObject.likes)
})

afterAll( async () =>{
    await mongoose.connection.close()
})
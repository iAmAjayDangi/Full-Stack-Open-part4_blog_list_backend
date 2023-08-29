const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

beforeEach(async () =>{
    await Blog.deleteMany()
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
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
    const blogObject = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    }

    await api.post('/api/blogs').send(blogObject).expect(201).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length+1)
    expect(contents).toContain('TDD harms architecture')

})

test('missing likes property', async ()=>{
    const blogObject ={
        title: "test like",
        author: "Ajay Dangi",
        url: "http://localhost:3001"
    }

    await api.post('/api/blogs').send(blogObject).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const content = response.body.filter(r => r.title === 'test like')
    expect(content[0].likes).toBe(0)

})

test('missing url or title', async ()=>{
    const blogObject ={
        title: "test missing url or title",
        author: "Abhay Dangi"
    }

    await api.post('/api/blogs').send(blogObject).expect(400)
})

test('delete blog post', async() =>{
    const response = await api.get('/api/blogs')
    await api.delete(`/api/blogs/${response.body[0].id}`).expect(204)
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
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) =>{
    Blog.find({}).then(blogs =>{
        response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) =>{
    const body = request.body
    const blog = new Blog(body)
    blog.save().then(savedBlog =>{
        response.json(savedBlog)
    }).catch(error =>{
        next(error)
    })
})

module.exports = blogsRouter
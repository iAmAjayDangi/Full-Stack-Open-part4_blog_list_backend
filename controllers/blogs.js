const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) =>{
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) =>{
    const body = request.body

    if(body.title === undefined || body.url === undefined){
        return response.status(400).json({"error": 'Either url or title is missing'})
    }

    if(body.likes === undefined){
        body.likes = 0
    }
    const blog = new Blog(body)
    try{
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
    catch(exception){
        next(exception)
    }
})

module.exports = blogsRouter
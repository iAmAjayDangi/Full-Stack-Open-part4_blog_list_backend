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

blogsRouter.delete('/:id', async (request, response, next) =>{
    try{
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }
    catch{
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) =>{
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try{
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.json(updatedBlog)
    }
    catch{
        next(exception)
    }

})

module.exports = blogsRouter
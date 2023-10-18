const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) =>{
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response, next) =>{
    const body = request.body

    if(body.title === undefined || body.url === undefined){
        return response.status(400).json({"error": 'Either url or title is missing'})
    }


    const user = request.user
    // console.log(user)

    if(body.likes === undefined){
        body.likes = 0
    }
    const blogObject = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    }
    // console.log(blog)
    const blog = new Blog(blogObject)
    try{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }
    catch(exception){
        next(exception)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) =>{

    const blog = await Blog.findById(request.params.id)

    if(!(blog.user.toString() === request.user._id.toString())){
        return response.status(401).json({error: 'invalid user'})
    }

    
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
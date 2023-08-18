const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI).then(result =>{
    logger.info('connected to MongoDB')
}).catch(error =>{
    logger.info('error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

module.exports = app
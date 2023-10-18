const { response } = require('../app')
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('bearer ')) {
        return authorization.replace('bearer ', '')
    }
    return null
}

const tokenExtractor = (request, response, next) => {
    const token = getTokenFrom(request)
    request.token = token
    next()
}

const userExtractor = async (request, response, next) => {

    if (request.token !== null) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)


        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        request.user = user
    }
    next()
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor
}
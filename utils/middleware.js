const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) =>{
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('bearer ')){
        return authorization.replace('bearer ','')
    }
    return null
}

const tokenExtractor = (request, response, next) =>{
    const token = getTokenFrom(request)
    request.token = token
    next()
}

module.exports = {
    requestLogger,
    tokenExtractor
}
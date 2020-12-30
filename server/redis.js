const redis = require('redis')

// Redis initialization
let redisClient = redis.createClient()
redisClient.on('connect', () => console.log('Successfully connected to redis.'))
redisClient.on('error', err => console.error('Redis error: ', err))

module.exports = redisClient
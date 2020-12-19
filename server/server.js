const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const redis = require('redis')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', () => console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`))

app.use(cookieParser())
app.use(express.json())

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false, // TODO: Change when actually in the server
  },
  store: new RedisStore({ host: 'localhost', port: 6379, client: redisClient }),
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
}))

app.use(cors({
  origin: [
    'http://localhost:8080'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}))

// Log redis errors
redisClient.on('error', err => console.error('Redis error: ', err))

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const uscRouter = require('./routes/usc')
app.use('/usc', uscRouter)

app.listen(3000, () => console.log('Server listening on port 3000'))
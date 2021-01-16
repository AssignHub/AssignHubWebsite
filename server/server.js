const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// Redis initialization
const RedisStore = require('connect-redis')(session)
const redisClient = require('./redis')

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', () => console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`))

// Middleware
app.use(cookieParser())
app.use(express.json())

// Configure session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false, // TODO: Change when actually in the server
  },
  store: new RedisStore({ host: 'localhost', port: 6379, client: redisClient }),
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
})
const sharedSession = require('express-socket.io-session')
app.use(sessionMiddleware)

// Cors
app.use(cors({
  origin: [
    'http://localhost:8080'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}))

// Routes
const generalRouter = require('./routes/general')
app.use('/general', generalRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const uscRouter = require('./routes/usc')
app.use('/usc', uscRouter)

const assignmentsRouter = require('./routes/assignments')
app.use('/assignments', assignmentsRouter)

const friendsRouter = require('./routes/friends')
app.use('/friends', friendsRouter)

// Server
const server = app.listen(3000, () => console.log('Server listening on port 3000'))

const io = require('./websockets').initialize(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  },
})

io.use(sharedSession(sessionMiddleware))

/*io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})*/
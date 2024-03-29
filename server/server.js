const express = require('express')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config()

// Log timestamps
const log = console.log
console.log = (...args) => {
  log(`[${new Date().toLocaleString()}]`, ...args)
}
const errLog = console.error
console.error = (...args) => {
  errLog(`[${new Date().toLocaleString()}]`, ...args)
}

// Redis initialization
const RedisStore = require('connect-redis')(session)
const redisClient = require('./redis')

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', () => console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`))

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())

// Configure session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false, // TODO: verify this doesn't screw stuff up
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
    'http://localhost:8080',
    'http://localhost:3001'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}))

// Routes
const generalRouter = require('./routes/general')
app.use('/general', generalRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const classesRouter = require('./routes/classes')
app.use('/classes', classesRouter)

const assignmentsRouter = require('./routes/assignments')
app.use('/assignments', assignmentsRouter)

const friendsRouter = require('./routes/friends')
app.use('/friends', friendsRouter)

const syllabiRouter = require('./routes/syllabi')
app.use('/syllabi', syllabiRouter)

// Server
const server = app.listen(3000, () => console.log('Server listening on port 3000'))

// Socket.io
const io = require('./websockets').init(server, {
  path: '/sockets',
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

// Start Tasks
require('./scheduler').scheduleTasks()

// Discord bot
require('./discord_bot').init()

require('./schools/emails_map').init()

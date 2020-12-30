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

// Cors
app.use(cors({
  origin: [
    'http://localhost:8080'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}))

// Routes
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const uscRouter = require('./routes/usc')
app.use('/usc', uscRouter)

const assignmentsRouter = require('./routes/assignments')
const { client } = require('./redis')
app.use('/assignments', assignmentsRouter)

// Server
const server = app.listen(3000, () => console.log('Server listening on port 3000'))

// Sockets
const socketClients = {}
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  },
})
io.on('connection', socket => {
  //console.log('client connected!')
  socket.on('disconnect', () => {
    //console.log('client disconnected!')
  })
})
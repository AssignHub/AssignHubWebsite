const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', () => console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`))

app.use(cors())
app.use(express.json())

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const uscRouter = require('./routes/usc')
app.use('/usc', uscRouter)

app.listen(3000, () => console.log('Server listening on port 3000'))
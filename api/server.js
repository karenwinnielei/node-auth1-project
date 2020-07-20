const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/usersRouter')
const authRouter = require('../auth/authRouter')
const dbConnection = require('../database/connection')
const authenticate = require('../auth/authenticateMiddleware')

const server = express()

const sessionConfiguration = {
  name: 'test',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  })
}

server.use(session(sessionConfiguration))
server.use(helmet())
server.use(express.json())
server.use(cors())

server.use('/api/users', authenticate, usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res)=>{
  res.json({api: 'up'})
})

module.exports = server
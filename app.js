require('./config/database').connect()//importando configurações de conexão com MongoDB
require('dotenv').config()//importando as váriaves de ambiente 
const express = require('express') //incluindo o modulo do framework Express
const app = express() 
const jwt = require('jsonwebtoken')

const cors = require('cors')

const login = require('./routes/login')
const register = require('./routes/register')
const auth = require('./middlewares/auth')

app.use(cors())

//
app.use(express.urlencoded({
    extended: true
}))
//Parse de informações vindas de uma requisição post
app.use(express.json())

//Register
app.use('/register', register)

//login
app.use('/login', login)

app.get('/', (req, res) => {
    res.send('Olá')
})

//**Rota com autenticação(middleware) */
app.get("/welcome", auth, (req, res) =>{
    res.status(200).json({Message: 'Welcome 🚀'})
})


//Exportando modulo 
module.exports = app
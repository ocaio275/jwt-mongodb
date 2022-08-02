require('./config/database').connect()
require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const cors = require('cors')

const User = require('./model/user')
const auth = require('./middlewares/auth')

app.use(cors())

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.post("/register", async (req, res) => {

    try {
        const { first_name, last_name, email, password } = req.body

        if(!(first_name && last_name && email && password)){
            res.status(400).json({Message: 'Todas as credenciais são obrigatórias '})
            return
        }

        const oldUser = await User.findOne({email})

        if(oldUser){
            res.status(409).json({Message: 'Usuário existente, realiza o login'})
            return
        }

        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            email,
            password: encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '240000',
            }
        )

        user.token = token

        res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if(!(email && password)){
            res.status(400).send('Usuário e senha são obrigatórios!!')
            return
        }

        const user = await User.findOne({ email })

        if(user && (await (bcrypt.compare(password, user.password)))){
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '240000'
                }
            )

            user.token = token

            res.status(200).json(user.token)
            return
        }
        res.status(400).json({Message: 'Usuário invalido'})
    } catch (error) {
        console.log(error)
    }
})

app.get('/', (req, res) => {
    res.send('Olá')
})

app.get("/welcome", auth, (req, res) =>{
    res.status(200).json({Message: 'Welcome 🚀'})
})



module.exports = app
const express = require('express')
const loginRouter = express.Router();

require('dotenv').config()//importando as váriaves de ambiente 
require('./config/database').connect()//importando configurações de conexão com MongoDB

const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

const User = require('./model/user')

/** Rota de login de modo assíncrona */
loginRouter.post("/", async (req, res) => {
    try {
        /** Desestruturando o obj vindo pela requisição */
        const { email, password } = req.body
        /**Verificando se tem algum campo vazio e alterando o status para 400(o servidor não entendeu a requisição pois está com uma sintaxe inválida)*/
        if(!(email && password)){
            res.status(400).send('Usuário e senha são obrigatórios!!')
            return
        }
        /**Procurando o email fornecido dentro do Mongo */
        const user = await User.findOne({ email })

        /**Validando dados vindo dados para o login */
        /** bcrypt.compare(), estou comparando se a senha é igual a senha amazenado no banco(Criptografado) */
        if(user && (await (bcrypt.compare(password, user.password)))){
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '240000'
                }
            )

            user.token = token
             
            /**Madando o token para o client */
            res.status(200).json(user.token)
            return
        }
        /**Caso não encontre o usuário */
        res.status(400).json({Message: 'Usuário invalido'})
    } catch (error) {
        console.log(error)
    }
})

module.exports = loginRouter
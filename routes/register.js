const express = require('express')
const registerRouter = express.Router()


require('dotenv').config()//importando as váriaves de ambiente 
require('./config/database').connect()//importando configurações de conexão com MongoDB

const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

const User = require('./model/user')

//Rota para criação de usuário e login
registerRouter.post("/", async (req, res) => {

    try {

        const { first_name, last_name, email, password } = req.body //Desestruturação do obj vindo pela requisição

        /** Verificar se tem algum campo vazio e alterando o status HTTP 400(o servidor não entendeu a requisição pois está com uma sintaxe inválida) */
        if(!(first_name && last_name && email && password)){
            res.status(400).json({Message: 'Todas as credenciais são obrigatórias '})
            return
        }

        /** Criando const para verificar se tem algum email já cadastrado no mongo de modo assíncrona */
        const oldUser = await User.findOne({email})

        /** Caso tenha algum email cadastrado altera o status HTTP para 409 (requisição conflitar com o estado atual do servidor.) */
        if(oldUser){
            res.status(409).json({Message: 'Usuário existente, realiza o login'})
            return
        }
        /**Gerar hash co fator de custo 10 */
        encryptedPassword = await bcrypt.hash(password, 10)

        /**Criando usuário com Model User */
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: encryptedPassword
        })

        /**Criando token com JWT valido por 4 minuto */
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '240000',
            }
        )

        user.token = token
         
        /**Mudando status 201(A requisição foi bem sucedida e um novo recurso foi criado como resultado.) */
        res.status(201).json(user)
    } catch (error) {
        console.log(error) // Caso tenha algum erro
    }
})

module.exports = registerRouter
const mongoose = require('mongoose')

const { DB_USER } = process.env
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

exports.connect = () => {
    mongoose.connect(`URI_MONGO`)
    .then(() =>{
        console.log('Conectado ao MongoDB 🚀')
    })
    .catch((error) =>{
        console.log('Erro ao se conectar')
        console.error(error)
        process.exit(1)
    })
}
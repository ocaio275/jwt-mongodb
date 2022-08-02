require('dotenv').config()

const { API_PORT } = process.env
const app = require('./app')


app.listen(API_PORT, () => console.log(`Servidor rodando: http://localhost:${API_PORT}`))
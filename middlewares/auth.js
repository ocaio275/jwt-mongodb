require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) {
        res.status(403).json({ Message: 'Um token é necessário para autenticação' })
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decoded
       
    } catch (error) {
        res.status(401).json({Message: "Token invalido"})
        console.log(error)
        return
    }
    next()
}

module.exports = verifyToken
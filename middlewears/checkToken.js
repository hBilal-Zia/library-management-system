require('dotenv').config()
const jwt = require('jsonwebtoken')
const { apiFailedResponse } = require('../utils/responseTempelate')
const { Model } = require('sequelize')



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    // console.log("Authorization Header:", authHeader);
    if (!authHeader) {
        return res.status(401).send(apiFailedResponse('Unauthorized', {}, []));
    }
    try {
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(decoded)
        req.body.user_id = decoded.id
        req.body.genres = decoded.genres
        // console.log(req.body.genres)
        next()
    } catch (error) {
        return res.status(409).send(apiFailedResponse('Forbidden', {error}, []));
    }

}


module.exports = {
    verifyToken
}
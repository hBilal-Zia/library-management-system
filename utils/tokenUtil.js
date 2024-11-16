require('dotenv').config()
const jwt = require('jsonwebtoken');

const generateAccessToken = (userData) => {
    console.log(userData.Genres)
    const payload = { id: userData.id, genres: userData.Genres };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn:  process.env.EXPIRATION_TIME});
    return token;
}

const generateRefreshToken = (userData) => {
    console.log(userData.Genres)
    const payload = { id: userData.id, genres: userData.Genres };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn:  process.env.REFRESH_EXPIRATION_TIME});
    return token;
}

module.exports = { 
    generateAccessToken,
    generateRefreshToken
}

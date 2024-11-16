const express = require('express')
const { validateSignUp, validateLogin } = require('../utils/validators')
const { signUp, login } = require('../controllers/authController')
const router = express.Router()

router.post('/sign-up', validateSignUp(), signUp)
router.post('/login', validateLogin(), login)


module.exports = router
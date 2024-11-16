const express = require('express')
const { getMe, subscribeToGenre } = require('../controllers/userController')
const { validateGetMe, validateSubscribeToGenre } = require('../utils/validators')
const router = express.Router()



router.get('/me', validateGetMe(), getMe)
router.post('/join-genre', validateSubscribeToGenre(), subscribeToGenre)



module.exports = router
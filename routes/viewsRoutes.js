const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('home')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'User Login'
    })
})

router.get('/home', (req, res) => {
    res.render('home')
})

router.get('/books/:id', (req, res) => {
    res.render('bookDetail')
})

router.get('/profile', (req, res) => {
    res.render('profile')
})


module.exports = router
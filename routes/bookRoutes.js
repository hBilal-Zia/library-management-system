const express = require('express')
const { validateCreateBook, validateUpdateBook, validateBook } = require('../utils/validators')
const { verifyToken } = require('../middlewears/checkToken')
const { getBooks, createBook, updateBook, deleteBook, getBookById, issueBook, returnBook } = require('../controllers/bookController')
const router = express.Router()

router.get('/', getBooks)
router.get('/:id', validateBook(), getBookById)
router.post('/',  validateCreateBook(), createBook)
router.put('/:id', validateUpdateBook(), updateBook)
router.delete('/:id', validateBook(), deleteBook)
router.post('/issue', issueBook)
router.post('/return', returnBook)

module.exports = router


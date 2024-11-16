const { Book, Genre, User } = require('../models');
const { apiFailedResponse, apiSuccessResponse } = require('../utils/responseTemplate');
const { checkValidation } = require('../utils/validators');
const { getSocketIO } = require('../socket')
const { getUserSocketId } = require('../utils/socketUtil')
const { isGenreExists } = require('../utils/global')


const getBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [
                { model: Genre, as: 'genre', attributes: [ 'id', 'name'] },
                { model: User, as: 'issuedTo', attributes: [ 'id', 'name']}
                // { model: User, attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
            ],
        });

        if (books.length === 0) {
            return res.status(404).send(apiFailedResponse("No Book Found", {}, []));
        }

        // console.log(books)
        return res.status(200).send(apiSuccessResponse('Books', books));
    } catch (error) {
        console.log(error);
        
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const getBookById = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const bookId = parseInt(req.params.id);
        const book = await Book.findByPk(bookId,{
            include: [
                { model: Genre, as: 'genre', attributes: [ 'id', 'name'] },
                { model: User, as: 'issuedTo', attributes: [ 'id', 'name']}
                // { model: User, attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
            ],
        });

        if (!book) {
            return res.status(404).send(apiFailedResponse('No Book Found', {}, []));
        }

        return res.status(200).send(apiSuccessResponse('Book', book));
    } catch (error) {
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const createBook = async (req, res) => {
    try {
        // console.log(req.body)
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const genreId = parseInt(req.body.genre_id);
        if(! await isGenreExists(genreId)){
            // console.log('in not found block')
            return res
            .status(400)
            .send(apiFailedResponse("Invalid Genre Id", {}, []));
        }
        const genre = await Genre.findByPk(genreId);
        // if (!isGenreExists) {
        //     return res
        //     .status(400)
        //     .send(apiFailedResponse("Invalid Genre Id", {}, []));
        // }

        const newBookData = {
            title: req.body.title,
            author: req.body.author,
            genre_id: req.body.genre_id, 
            created_by: req.body.user_id,
            updated_by: req.body.user_id,
        };

        // console.log(isGenreExists)
        const book = await Book.create(newBookData);
        console.log(book)

       const io = getSocketIO()
       io.to(`genre_${req.body.genre_id}`).emit('bookAdded', {
        bookId: book.id,
        title: book.title,
        genreId: genre.id,
        genreName: genre.name
    });
        
        return res.status(201).send(apiSuccessResponse('Book Created Successfully', book));
    } catch (error) {
        console.log(error)
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {error}, []));
    }
};

const updateBook = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const genreId = parseInt(req.body.genre_id);
        if(! await isGenreExists(genreId)){
            // console.log('in not found block')
            return res
            .status(400)
            .send(apiFailedResponse("Invalid Genre Id", {}, []));
        }
        // const genreId = parseInt(req.body.genre_id);
        // const isGenreExists = await Genre.findByPk(genreId);
        // if (!isGenreExists) {
        //     return res
        //     .status(400)
        //     .send(apiFailedResponse("Invalid Genre Id", {}, []));
        // }

        const updateData = {
            title: req.body.title,
            author: req.body.author,
            genre_id: req.body.genre_id, // Assuming this is passed in the request body
            updated_by: req.body.user_id, // Hardcoded or retrieve from session
        };

        const bookId = parseInt(req.params.id);
        const bookToUpdate = await Book.findByPk(bookId,{
            include: [
                { model: Genre, as: 'genre', attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
            ],
        });

        if (!bookToUpdate) {
            return res.status(404).send(apiFailedResponse('Book Not Found', {}, []));
        }

        await bookToUpdate.update(updateData);
        
        const io = getSocketIO();
        io.to(`genre_${req.body.genre_id}`).emit('bookUpdated', {
            bookId: bookToUpdate.id,
            title: bookToUpdate.title,
            genreId: bookToUpdate.genre.id,
            genreName: bookToUpdate.genre.name
        });
        // .emit('bookUpdated', bookToUpdate.title, bookToUpdate.genre.name);

        
        return res.status(200).send(apiSuccessResponse('Book Updated Successfully', bookToUpdate));
    } catch (error) {
        console.log(error)
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {error}, []));
    }
};

const deleteBook = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const bookId = parseInt(req.params.id);
        const bookToDelete = await Book.findByPk(bookId,{
            include: [
                { model: Genre, as: 'genre', attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
                // { model: User, attributes: [ 'id', 'name'] },
            ],
        });

        
        if (!bookToDelete) {
            return res.status(404).send(apiFailedResponse('Book Not Found', {}, []));
        }

        await bookToDelete.destroy();
        console.log(
            {
                bookId: bookToDelete.id,
                title: bookToDelete.title,
                genreId: bookToDelete.genre.id,
                genreName: bookToDelete.genre.name
        })

        const io = getSocketIO();
        io.to(`genre_${bookToDelete.genre_id}`).emit('bookDeleted', {
            bookId: bookToDelete.id,
            title: bookToDelete.title,
            genreId: bookToDelete.genre.id,
            genreName: bookToDelete.genre.name
        });
        // .emit('bookDeleted', bookToDelete.title, bookToDelete.genre.name);
        // console.log(bookToDelete.tit)
       
        return res.status(200).send(apiSuccessResponse('Book Deleted Successfully', bookToDelete));
    } catch (error) {
        console.log(error)
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const issueBook = async (req, res) => {
    const { user_id, bookId } = req.body;

    try {
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).send(apiFailedResponse('User not found', {}, []));
        }
        const book = await Book.findOne(
            {
                where: {
                    id: bookId,
                    is_available: true

        }});

        if (!book) {
            const io = getSocketIO();
            const userSocketId = getUserSocketId(user_id); // Retrieve the specific user’s socket ID

            if (userSocketId) {
                io.to(userSocketId).emit('bookUnavailable', {
                    message: `Book ${bookId} is currently unavailable.`,
                    bookId: bookId,
                });
            }
            return res.status(404).send(apiFailedResponse('Book not found', {}, []));
        }
        await book.update({
            issued_to: user_id,
            is_available: false
        })



        // Additional logic for checking availability, etc., can go here

        // await user.addBook(book); // Assuming association is set up between User and Book
        return res.status(200).send(apiSuccessResponse('Book issued successfully'));
    } catch (error) {
        console.error('Error issuing book:', error);
        return res.status(500).send(apiFailedResponse('Something went wrong', {}, []));
    }
};

const returnBook = async (req, res) => {
    const { user_id, bookId } = req.body;

    try {
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).send(apiFailedResponse('User not found', {}, []));
        }
        const book = await Book.findOne(
            {
                where: {
                    id: bookId,
                    is_available: false

        }});

        if (!book) {
            return res.status(404).send(apiFailedResponse('Book not found', {}, []));
        }
        await book.update({
            issued_to: null,
            is_available: true
        })
        
        const room = `book-${bookId}`;
        const io = getSocketIO();
        const userSocketId = getUserSocketId(user_id);
        io.to(room).emit('bookAvailable', { message: `Book ${bookId} is now available for issue.` });
        console.log('user is informed')
        io.sockets.sockets.get(userSocketId)?.leave(room);
        console.log('User removed from the room');
        // io.socketsLeave(room);
        return res.status(200).send(apiSuccessResponse('Book returned successfully'));
    } catch (error) {
        console.error('Error returning book:', error);
        return res.status(500).send(apiFailedResponse('Something went wrong', {}, []));
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
};

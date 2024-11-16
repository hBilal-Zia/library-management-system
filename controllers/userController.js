const { User, Genre, Book } = require('../models')
const { apiSuccessResponse, apiFailedResponse } = require('../utils/responseTempelate')
const { checkValidation } = require('../utils/validators')
const { isGenreExists } = require('../utils/global')
const { getSocketIO } = require('../socket')

const getMe = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(
                apiFailedResponse(
                    validation.message,
                    validation.data,
                    validation.errors
                )
            );
        }
        const userId = parseInt(req.body.user_id)
        const me = await User.findByPk(userId, {
            attributes: [
                'id',
                'name',
                'email',
                'refresh_token'
            ],
            include: [
                {
                    model: Genre,
                    attributes: [ 'id', 'name']
                },
                {
                    model: Book,
                    as: 'issuedTo',
                    attributes: ['id', 'title']
                }
            ]
        })
        if (!me) {
            return res.status(400).send(apiFailedResponse('No User Found', {}, []))
        }
        return res.status(200).send(apiSuccessResponse('User found', me))
    } catch (error) {
        console.log(error)
        return res.status(500).send(apiFailedResponse('Something went wrong', {}, []));

    }
}

const subscribeToGenre = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(
                apiFailedResponse(
                    validation.message,
                    validation.data,
                    validation.errors
                )
            );
        }
        const genreId = parseInt(req.body.genre_id);
        if(! await isGenreExists(genreId)){
            // console.log('in not found block')
            return res
            .status(400)
            .send(apiFailedResponse("Invalid Genre Id", {}, []));
        }

        const user = await User.findByPk(req.body.user_id)

        if (!user) {
            return res.status(400).send(apiFailedResponse('No User Found', {}, []))
        }

        await user.addGenre(genreId)
        const io = getSocketIO();
        io.join(`genre-${genreId}`);
        return res.status(200).send(apiSuccessResponse('Genre Successfully Subscribed'))

    } catch (error) {
        return res.status(500).send(apiFailedResponse('Something went wrong', {}, [])); 
    }

}

module.exports = {
    getMe,
    subscribeToGenre

}
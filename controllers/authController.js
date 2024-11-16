const { User, Genre } = require('../models')
const { apiSuccessResponse, apiFailedResponse } = require('../utils/responseTemplate')
const { checkValidation } = require('../utils/validators')
const bcrypt = require('bcryptjs')
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil')
const { where } = require('sequelize')


const signUp = async (req, res) => {
    try {
        const validation = checkValidation(req)
        if (validation.has_errors) {
            return res.status(400).send(
                apiFailedResponse(
                    validation.message,
                    validation.data,
                    validation.errors
                )
            )  
        }
    const { name, email, password } = req.body

    const emailExits = await User.findOne({where: {email}})
    if (emailExits) {
        return res.status(400).send(apiFailedResponse('Email already exsits', {}, []))
    }

    const genreId = parseInt(req.body.genreId)
    const genre = await Genre.findByPk(genreId)
    if (!genre) {
        return res.status(400).send(apiFailedResponse('Invalid Genre Id', {}, []))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    user.addGenre(genreId)

    return res.status(200).send(apiSuccessResponse('User sign up successfull', user))
    } catch (error) {
        return res.status(500).send(apiFailedResponse('Somthing went wrong', {}, []))
    }
}

const login = async (req, res) => {
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

        const { email, password } = req.body;

        
        const user = await User.findOne({
            attributes: [
                'id',
                'name',
                'email',
                'password',
                'refresh_token'
            ],
            where: { email },
            include: [
                {
                    model: Genre,
                    attributes: [ 'id', 'name']
                }
            ]
        });
        if (!user) {
            return res.status(400).send(apiFailedResponse('Invalid email or password', {}, []));
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send(apiFailedResponse('Invalid email or password', {}, []));
        }

        user.Genres = user.Genres.map((genre) => {
            return { id: genre.id, name: genre.name };
        })
        console.log(user.Genres)
        user.accessToken = generateAccessToken(user)
        user.refreshToken = generateRefreshToken(user)
        await User.update(
            {
                refresh_token: user.refreshToken
            },
            {
                where: {
                    id: user.id
                }
            }
        )
       
        
        // user.Genres.forEach(genre => {
        //     console.log(genre.name)
        // });
       
        
       
        return res.status(200).send(apiSuccessResponse('Login successful', responseData(user)));
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send(apiFailedResponse('Something went wrong', {}, []));
    }
}

const responseData = (data) => {
    const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        genres: data.Genres.map(genre => ({ id: genre.id, name: genre.name }))
    };
    return user;
}



module.exports = {
    signUp,
    login
}
const { Genre } = require('../models');
const { apiFailedResponse, apiSuccessResponse } = require('../utils/responseTemplate');
const { checkValidation } = require('../utils/validators');

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll();

        if (genres.length === 0) {
            return res.status(404).send(apiFailedResponse("No Genres Found", {}, []));
        }

        return res.status(200).send(apiSuccessResponse('Genres', genres));
    } catch (error) {
        // console.error("Error fetching genres:", error);
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const getGenreById = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const genreId = parseInt(req.params.id);
        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).send(apiFailedResponse('Genre Not Found', {}, []));
        }

        return res.status(200).send(apiSuccessResponse('Genre', genre));
    } catch (error) {
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const createGenre = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const newGenreData = {
            name: req.body.name,
        };

        const genre = await Genre.create(newGenreData);
        return res.status(201).send(apiSuccessResponse('Genre Created Successfully', genre));
    } catch (error) {
        console.error("Error creating genre:", error);
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const updateGenre = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const genreId = parseInt(req.params.id);
        const genreToUpdate = await Genre.findByPk(genreId);

        if (!genreToUpdate) {
            return res.status(404).send(apiFailedResponse('Genre Not Found', {}, []));
        }

        const updateData = {
            name: req.body.name,
        };

        await genreToUpdate.update(updateData);
        return res.status(200).send(apiSuccessResponse('Genre Updated Successfully', genreToUpdate));
    } catch (error) {
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

const deleteGenre = async (req, res) => {
    try {
        const validation = checkValidation(req);
        if (validation.has_errors) {
            return res.status(400).send(apiFailedResponse(
                validation.message,
                validation.data,
                validation.errors
            ));
        }

        const genreId = parseInt(req.params.id);
        const genreToDelete = await Genre.findByPk(genreId);

        if (!genreToDelete) {
            return res.status(404).send(apiFailedResponse('Genre Not Found', {}, []));
        }

        await genreToDelete.destroy();
        return res.status(200).send(apiSuccessResponse('Genre Deleted Successfully'));
    } catch (error) {
        return res.status(500).send(apiFailedResponse('Something Went Wrong', {}, []));
    }
};

module.exports = {
    getGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre
};

const { Genre } = require('../models')

const isGenreExists = async (id) => {
        
        try {
            if (await Genre.findByPk(id)) {
                // console.log('genre found')
                return true
            }
            // console.log('genre not found')
            return false
        } catch (error) {
            // console.log('in catch block')
            return false
        }
}

module.exports = {
    isGenreExists
}
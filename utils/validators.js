const { body, validationResult, param } = require('express-validator')


const validateCreateBook = () => {
   return [
        body('user_id').trim().not().isEmpty().withMessage('User ID should not be empty')
            .isNumeric().withMessage('User ID  should be a number'),
        body('title').trim().not().isEmpty().withMessage('Title should not be empty'),
        body('author').trim().not().isEmpty().withMessage('Author should not be empty'),
        body('genre_id').trim().not().isEmpty().withMessage('Genre should not be empty')
            .isNumeric().withMessage('Genre should be a number'),
   ]

   
}


const validateUpdateBook = () => {
    return [
        body('user_id').trim().not().isEmpty().withMessage('User ID should not be empty')
        .isNumeric().withMessage('User ID  should be a number'),
        param('id').trim().not().isEmpty().withMessage('id should not be empty')
            .isNumeric().withMessage('id should be a number'),
        body('title').trim().not().isEmpty().withMessage('Title should not be empty'),
        body('author').trim().not().isEmpty().withMessage('Author should not be empty'),
        body('genre_id').trim().not().isEmpty().withMessage('Genre should not be empty')
            .isNumeric().withMessage('Genre should be a number'),
    ]
    
}

const validateBook = () => {
    return [
        param('id').trim().not().isEmpty().withMessage('id should not be empty')
            .isNumeric().withMessage('id should be a number')
    ]

    
}

const validateSignUp = () => {
    return [
        body('name').trim().not().isEmpty().withMessage('Name should not be empty'),
        body('email').trim().not().isEmpty().withMessage('Email should not be empty')
            .isEmail().withMessage('Invalid Email format'),
        body('password').trim().not().isEmpty().withMessage('Password should not be empty'),
        body('genreId').trim().not().isEmpty().withMessage('Genre should not be empty')
            .isNumeric().withMessage('Genre should be a number'),

    ]

    
}

const validateLogin = () => {
    return [
        body('email').trim().not().isEmpty().withMessage('Email should not be empty'),
        body('password').trim().not().isEmpty().withMessage('Password should not be empty')
    ]

    
}

const validateCreateGenre = () => {
    return [
        body('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name should not be empty')
            .isString()
            .withMessage('Name should be a string'),
    ];
};

const validateUpdateGenre = () => {
    return [
        param('id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('ID should not be empty')
            .isNumeric()
            .withMessage('ID should be a number'),
        body('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Name should not be empty')
            .isString()
            .withMessage('Name should be a string'),
    ];
};

const validateGenre = () => {
    return [
        param('id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('ID should not be empty')
            .isNumeric()
            .withMessage('ID should be a number'),
    ];
};

const checkValidation = (req) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        let validationErrors = []
        errors.array({
            onlyFirstError: true
        }).forEach((error, i) => {
            validationErrors[i] = error.msg
        });
        return {
            has_errors: true,
            message: 'Validation Errors',
            errors: validationErrors,
            error_code: 500,
            data: [],
        }
    } else{
        return {
            has_errors: false
        }
    }
}

const validateGetMe = () => {
    return [
        body('user_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('User ID should not be empty')
            .isNumeric()
            .withMessage('User ID should be a number'),
    ];
}

const validateSubscribeToGenre = () => {
    return [
        body('user_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('User ID should not be empty')
            .isNumeric()
            .withMessage('User ID should be a number'),
        body('genre_id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Genre ID should not be empty')
            .isNumeric()
            .withMessage('Genre ID should be a number'),
    ];
}

module.exports = {
    validateCreateBook,
    validateUpdateBook,
    validateBook,
    validateSignUp,
    validateLogin,
    validateCreateGenre,
    validateUpdateGenre,
    validateGenre,
    validateGetMe,
    validateSubscribeToGenre,
    checkValidation,
}
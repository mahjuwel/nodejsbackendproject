const { body } = require('express-validator');

const validateProductBrandCreate = [
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
]

module.exports = { validateProductBrandCreate }
const { body } = require('express-validator');

const validateDbPointCreate = [
    body('dbPointName').notEmpty().withMessage('db Point Name is required').isString().withMessage('db Point Name must be a string'), body('areaName').notEmpty().withMessage('Area Name is required').isString().withMessage('Area Name must be a string'),
]

module.exports = { validateDbPointCreate }
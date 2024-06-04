const { body } = require('express-validator');

const validateAreaCreate = [
    body('regionName').notEmpty().withMessage('Region Name is required').isString().withMessage('Region Name must be a string'), body('areaName').notEmpty().withMessage('Area Name is required').isString().withMessage('Area Name must be a string')
]

const validateAreaUpdate = [
    body('regionName').optional().isString().withMessage('Region Name must be a string'), body('areaName').optional().isString().withMessage('Area Name must be a string'),
]

module.exports = { validateAreaCreate, validateAreaUpdate }
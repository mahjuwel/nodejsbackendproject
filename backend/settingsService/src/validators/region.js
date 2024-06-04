const { body } = require('express-validator');

const validateRegionCreate = [
    body('zoneName').notEmpty().withMessage('Zone Name is required').isString().withMessage('Zone Name must be a string'), body('regionName').notEmpty().withMessage('Region Name is required').isString().withMessage('Region Name must be a string')
]

const validateRegionUpdate = [
    body('zoneName').optional().isString().withMessage('Zone Name must be a string'), body('regionName').optional().isString().withMessage('Region Name must be a string')
]

module.exports = { validateRegionCreate, validateRegionUpdate }
const { body } = require('express-validator');

const validateBankCreate = [
    body('salesOrgName').notEmpty().withMessage('Sales Org Name is required').isString().withMessage('Sales Org Name must be a string'), body('bankName').notEmpty().withMessage('Bank Name is required').isString().withMessage('Bank Name must be a string')
]

const validateBankUpdate = [
    body('salesOrgName').optional().isString().withMessage('Sales Org Name must be a string'), body('bankName').optional().isString().withMessage('Bank Name must be a string'),
]

module.exports = { validateBankCreate, validateBankUpdate }
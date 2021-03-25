const { check, validationResult } = require('express-validator')

exports.userValidationResult = (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const error = result.array()[0].msg
        return res.status(422).json({ error: error })
    }

    next()
}

exports.userValidator = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isLength({ min: 6, max: 255 })
        .withMessage('Name must be 6 to 255 characters long'),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be 8 to 20 characters long'),
    check('mobile')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Mobile Number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile Number must be of 10 digits')
        .isNumeric()
        .withMessage('Mobile Number should contains only digits from 0 to 9'),
] 

exports.userValidator1 = [
  
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 1024 })
        .withMessage('Password must be 8 to 20 characters long')

] 
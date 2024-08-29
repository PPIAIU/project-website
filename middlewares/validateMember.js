const {schemaMember} = require('../schemas/member')
const ErrorHandler = require('../utils/ErrorHandler')

module.exports = (req, res, next) => {
    const {error } = schemaMember.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next()
    }
}
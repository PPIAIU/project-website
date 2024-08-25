const {schemaPeriode} = require('../schemas/periode')

const ErrorHandler = require('../utils/ErrorHandler')

module.exports = (req, res, next) => {
    const {error} = schemaPeriode.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next()
    }
}
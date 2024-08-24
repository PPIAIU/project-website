const {schemaDivisi} = require('../schemas/divisi')
const ErrorHandler = require('../utils/ErrorHandler')

module.exports = (req, res, next) => {
    const {error} = schemaDivisi.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ErrorHandler(msg, 400))
    } else {
        next()
    }
}
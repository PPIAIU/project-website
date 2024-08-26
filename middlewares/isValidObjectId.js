const mongoose = require('mongoose')

module.exports = (url) => {
    return async (req, res, next) => {
        const paramId = ['id', 'divisi_id', 'periode_id', 'member_id'].find(param => req.params[param])
        
        if (!paramId) {
            next()
        }

        const id = req.params[paramId]
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error_msg', 'Invalid Id/ data is not found')
            return res.redirect(url || '/')
        }
        next()
    }
}
const mongoose = require('mongoose')

module.exports = (url) => {
    return async (req, res, next) => {
        const paramId = ['id', 'divisi_id', 'periode_id', 'member_id'].find(param => req.params[param])
        
        console.log(`[isValidObjectId] ${req.method} ${req.originalUrl}, params:`, req.params, 'paramId:', paramId);
        
        if (!paramId) {
            console.log('[isValidObjectId] No paramId found, passing through');
            return next()
        }

        const id = req.params[paramId]
        console.log(`[isValidObjectId] Checking ${paramId}=${id}, valid:`, mongoose.Types.ObjectId.isValid(id));
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`[isValidObjectId] Invalid ObjectId ${id}, redirecting to ${url}`);
            req.flash('error_msg', 'Invalid Id/ data is not found')
            return res.redirect(url || '/')
        }
        console.log('[isValidObjectId] Valid ObjectId, continuing');
        next()
    }
}
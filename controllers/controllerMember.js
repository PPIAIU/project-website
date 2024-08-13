const Member = require('../models/member')
const Divisi = require('../models/divisi')

module.exports.create = (req, res) => {
    
    res.render('member/create')
}

module.exports.store = async (req, res) => {
    
}

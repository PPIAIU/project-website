const Member = require('../models/member')

module.exports.create = (req, res) => {
    res.render('member/create')
}
module.exports.index = async (req, res) => {
    const members = await Member.find()
    res.render('member/index', {members})
}
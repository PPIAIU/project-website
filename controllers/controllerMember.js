const Member = require('../models/member')
const Divisi = require('../models/divisi')

module.exports.show = async (req, res) => {
    const member = await Member.findById(req.params)
    res.render('divisi/show', member)
}
module.exports.create = (req, res) => {
    res.render('member/create')
}

module.exports.store = async (req, res) => {
    const {divisi_id} = req.params
    const divisi = await Divisi.findById(req.params.divisi_id)
    const member = new Member(req.body.member)
}


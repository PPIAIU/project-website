const Member = require('../models/member')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')

module.exports.show = async (req, res) => {
    const divisi = await Divisi.findById(req.params.id)
    const  member  = await Member.findById(req.params.id)
    console.log(member)
  res.render('member/show', { member })
}

module.exports.create = async (req, res) => {
    const {divisi_id} = req.params
    res.render('member/create',{divisi_id})
}

module.exports.store = async (req, res) => {
    const { divisi_id, periode_id } = req.params
    const divisi = await Divisi.findById(divisi_id)
    await console.log(periode_id)
    const periode = await Periode.findById(periode_id)
    const member = new Member(req.body.member)
    divisi.members.push(member)
    periode.members.push(member)
    console.log(member)
    console.log(divisi)
    await divisi.save()
    await member.save()
    res.redirect(`/divisi/${divisi._id}`)

    // res.status(500).json(member, divisi)
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const member = await Member.findById(id)
    res.render('/member/edit', member)
}

module.exports.update = async (req, res) => {
    const {id} = req.params
    const member = await Member.findByIdAndUpdate(id, req.body.member)
    res.redirect(`/member/${member._id}`)
}

module.exports.destroy = async (req, res) => {
    const {id, divisi_id} = req.params
    await Member.findByIdAndDelete(id)
    res.redirect(`/periode/${divisi_id}`)
}

 




const Member = require('../models/member')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')

module.exports.create = async (req, res) => {
    const {periode_id, divisi_id } = req.params
    console.log(periode_id)
    console.log(divisi_id)
    res.render('member/create',{periode_id, divisi_id})
}

module.exports.show = async (req, res) => {
    const {periode_id, divisi_id, member_id} = req.params
    console.log(member_id)
    const member = await Member.findById(member_id)
    res.render('member/show', {member, periode_id, divisi_id, member_id})
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
    await periode.save()
    req.flash('success_msg', 'Data is successfully stored')
    res.redirect(`/divisi/${periode._id}/${divisi._id}/show`)
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
    req.flash('success_msg', 'Data is successfully edited')
    res.redirect(`/member/${member._id}`)
}

module.exports.destroy = async (req, res) => {
    const {periode_id, divisi_id, id} = req.params
    await Member.findByIdAndDelete(id)
    req.flash('success_msg', 'Data is successfully deleted')
    // res.redirect(`/divisi/${periode_id}/${divisi_id}/show`)
    res.redirect('/periode')
}

 




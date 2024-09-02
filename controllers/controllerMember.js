const Member = require('../models/member')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')
const fs = require('fs')

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
    const image = req.files.map(file=> ({url: file.path, filename: file.filename}))
    const divisi = await Divisi.findById(divisi_id)
    const periode = await Periode.findById(periode_id)
    const member = new Member(req.body.member)
    member.author = req.user._id
    divisi.members.push(member)
    periode.members.push(member)
    member.image = image
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
    const {periode_id, divisi_id, member_id} = req.params
    const member = await Member.findById(member_id)
    res.render('member/edit', {member, periode_id, divisi_id, member_id})
}

module.exports.update = async (req, res) => {
    const {id} = req.params
    const member = await Member.findByIdAndUpdate(id, {...req.body.member})
    if(req.files && req.files.length > 0) {
        member.image.forEach(image => {
            fs.unlinkSync(image.url)
        })
        const image = req.files.map(file => ({url: file.path, filename: file.filename}))
        member.image = image
        await member.save()
    }

    req.flash('success_msg', 'Data is successfully edited')
    res.redirect(`/periode`)
}

module.exports.destroy = async (req, res) => {
    const {id} = req.params
    const member = await Member.findById(id)
    if(member.image.length > 0) {
        member.image.forEach(image => {
            fs.unlinkSync(image.url)
        })
    }
    await Member.findByIdAndDelete(req.params.id)

    req.flash('success_msg', 'Data is successfully deleted')
    // res.redirect(`/divisi/${periode_id}/${divisi_id}/show`)
    res.redirect('/periode')
}

 




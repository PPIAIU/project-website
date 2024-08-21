const Member = require('../models/member')
const Divisi = require('../models/divisi')

module.exports.show = async (req, res) => {
    const  member  = await Member.findById(req.params.id)
    console.log(member)
  res.render('member/show', { member })
}

module.exports.create = async (req, res) => {
    const {divisi_id} = req.params
    res.render('member/create',{divisi_id})
}

module.exports.store = async (req, res) => {
    const { divisi_id } = req.params
    const divisi = await Divisi.findById(divisi_id)
    const member = new Member(req.body.member)
    divisi.members.push(member)
    console.log(member)
    console.log(divisi)
    await divisi.save()
    await member.save()
    res.redirect(`/periode`)
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
    const {id} = req.params
    await Member.findByIdAndDelete(id)
    res.redirect(`/periode`)
}






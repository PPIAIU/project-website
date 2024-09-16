const express = require('express')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')
const Member = require('../models/member')
const fs = require('fs')

module.exports.show = async ( req, res) => {
    const {periode_id, divisi_id} = req.params
    const periode = await Periode.findById(periode_id)
    const divisi = await Divisi.findById(divisi_id)
    .populate({
        path: 'members'
    })
    console.log(periode)
    console.log(divisi)
    res.render('divisi/show', {divisi,periode, divisi_id, periode_id} )
}

module.exports.create = async (req, res) => {
    const {periode_id} = req.params
    res.render('divisi/create', {periode_id})
}

module.exports.store = async (req, res) => {
    const { periode_id } = req.params
    const divisi = new Divisi(req.body.divisi)
    const image = req.files.map(file => ({url: file.path, filename: file.filename}))
    const periode = await Periode.findById(periode_id)
    divisi.author = req.user._id
    divisi.image = image
    // .then(result => {
    //     res.status(201).json(result)
    // .catch(err => {
    //     res.status(500).json({err: "unsuccess"})
    // })
    // })
    console.log(divisi)
    console.log(periode)
    periode.divisis.push(divisi)
    await periode.save()
    await divisi.save()
    req.flash('success_msg', 'Data is successfully stored')
    res.redirect(`/periode/${periode._id}` )
}

module.exports.edit = async (req, res) => {
    const divisi = await Divisi.findById(req.params.divisi_id)
    res.render('divisi/edit', {divisi})
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const divisi = await Divisi.findByIdAndUpdate(id, {...req.body.divisi})
    if(req.files && req.files.length > 0 ) {
        divisi.image.forEach(image => {
            fs.unlinkSync(image.url)
        })
        const image = req.files.map(file => ({url: file.path, filename: file.filename}))
        divisi.image = image
    await divisi.save()
    }
    req.flash('success_msg', 'Data is successfully edited')
    res.redirect(`/periode`)
}

module.exports.destroy = async ( req, res) => {
    const {id} = req.params
    const divisi = await Divisi.findById(id)
    if (divisi.members && divisi.members.length > 0) {
        for (const memberId of divisi.members) {
            const member = await Member.findById(memberId);
            if (member && member.image) {
                member.image.forEach(image => {
                    if (image && image.url) {
                        fs.unlinkSync(image.url);
                    }
                });
                await Member.findByIdAndDelete(memberId);
            }
        }
    }
    if(divisi.image.length > 0) {
        divisi.image.forEach(image => {
            fs.unlinkSync(image.url)
        })
    }
    await Divisi.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Data is successfully deleted')
    res.redirect('/periode')
}


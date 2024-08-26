const express = require('express')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')

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
    const periode = await Periode.findById(periode_id)
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
    const divisi = await Divisi.findById(req.params)
    res.render('divisi/edit')
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const divisi = await Divisi.findByIdAndUpdate(id, req.body)
    req.flash('success_msg', 'Data is successfully edited')
    res.redirect(`/divisi/${divisi._id}`)
}

module.exports.destroy = async ( req, res) => {
    await Divisi.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Data is successfully deleted')
    res.redirect('/periode')
}


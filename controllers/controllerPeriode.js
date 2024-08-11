const Periode = require('../models/periode')

module.exports.index = async (req, res) => {
    const periodes = await Periode.find()
    res.render('periode/index', {periodes})
}

module.exports.create = async (req, res) => {
    res.render('periode/create')
}

module.exports.store = async (req, res) => {
    const periode = new Periode(req.body.name)
    await periode.save()
    res.redirect('/period/show')
}

module.exports.show = async (req, res) => {
    const periode = await Periode.findById(req.params.id)
    .populate({
        path: 'divisi'
    })
    res.render('periode/show', {periode})
}

module.exports.edit = async (req, res) => {
    const periode = await Periode.findById(req.params.id)
    res.render('periode/edit', {periode})
}

module.exports.update = async (req, res) => {
    const {id} = req.params;
    const 

}


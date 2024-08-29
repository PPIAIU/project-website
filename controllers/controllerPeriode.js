const Periode = require('../models/periode')

module.exports.index = async (req, res) => {
    const periodes = await Periode.find()
    res.render('periode/index', {periodes})
}

module.exports.create = async (req, res) => {
    res.render('periode/create')
}

module.exports.store = async (req, res) => {
    const periode = new Periode(req.body.periode)
    periode.author = req.user._id
    console.log(periode)
    await periode.save()
    // res.status(201).json(periode)
    // .then(result => {
        //     res.status(201).json(result)
        // })
        // .catch(err => {
            //     res.status(500).json({err: "could not send"})
            // })
    req.flash('success_msg', 'Data is successfully stored')
    res.redirect('/periode')
}

module.exports.show = async (req, res) => {
    const periode = await Periode.findById(req.params.id)
    .populate({
        path: 'divisis'
    })
    .populate({
        path: 'members'
    })
    res.render('periode/show', {periode})
}

module.exports.edit = async (req, res) => {
    const periode = await Periode.findById(req.params.id)
    res.render('periode/edit', {periode})
}

module.exports.update = async (req, res) => {
    const {id} = req.params;
    const periode = await Periode.findByIdAndUpdate(id, req.body.periode)
    await periode.save()
    req.flash('success_msg', 'Data is successfully edited')
    res.redirect('/periode')
}   

module.exports.destroy = async (req, res) => {
    await Periode.findOneAndDelete(req.params.id);
    req.flash('success_msg', 'Data is successfully deleted')
    res.redirect('/periode')
}


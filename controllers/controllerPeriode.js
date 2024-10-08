const Periode = require('../models/periode')
const Member = require('../models/member')
const Divisi = require('../models/divisi')
const fs = require('fs')


module.exports.index = async (req, res) => {
    const periodes = await Periode.find()
    res.render('periode/index', {periodes})
}

module.exports.create = async (req, res) => {
    res.render('periode/create')
}

module.exports.store = async (req, res) => {
    const image = req.files.map(file => ({ url: file.path, filename: file.filename }));
    console.log(image)
    const periode = new Periode(req.body.periode)
    periode.author = req.user._id
    periode.image = image;
    
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
    console.log(periode)
    res.render('periode/show', {periode})
}

module.exports.edit = async (req, res) => {
    const periode = await Periode.findById(req.params.id)
    res.render('periode/edit', {periode})
}

module.exports.update = async (req, res) => {
    const {id} = req.params;
    const periode = await Periode.findByIdAndUpdate(id, req.body.periode)

    if(req.files && req.files.length > 0) {
        periode.image.forEach(image => {
            fs.unlinkSync(image.url)
        })
        const image = req.files.map(file => ({ url: file.path, filename: file.filename}))
        periode.image = image;
        await periode.save()
    }

    req.flash('success_msg', 'Data is successfully edited')
    res.redirect('/periode')
}   

module.exports.destroy = async (req, res) => {
    const {id} = req.params
    const periode = await Periode.findById(id).populate('members')
     // Delete member images
     if (periode.members && periode.members.length > 0) {
        for (const member of periode.members) {
            if (member.image && member.image.length > 0) {
                for (const image of member.image) {
                    if (image && image.url) {
                        await fs.promises.unlink(image.url);
                    }
                }
            }
            await Member.findByIdAndDelete(member._id);
        }
    }
    //DELETE PERIODE IMAGE IN DIVISI
    if(periode.divisis && periode.divisis.length > 0) {
        for (const divisiId of periode.divisis) {
            const divisi = await Divisi.findById(divisiId);
            if (divisi && divisi.image) {
                divisi.image.forEach(image => {
                    if (image && image.url) {
                        fs.unlinkSync(image.url);
                    }
                });
                await Divisi.findByIdAndDelete(divisiId);
            }
        }
}
    periode.image.forEach(image => {
            fs.unlinkSync(image.url);
        });
    await Periode.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Data is successfully deleted')
    res.redirect('/periode')
}
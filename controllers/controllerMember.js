const Member = require('../models/member')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')
const fs = require('fs')
const {MongoClient, GridFSBucket} = require('mongodb')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')

let gridfsBucket, gfs;
const conn = mongoose.createConnection(process.env.MONGO_URI);

conn.once('open', () => {
    gridfsBucket = new GridFSBucket(conn.db, {bucketName: 'uploadMember'})
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploadMember')
})


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
    const image = req.file
    const divisi = await Divisi.findById(divisi_id)
    const periode = await Periode.findById(periode_id)
    const member = new Member(req.body.member)
    member.author = req.user._id
    divisi.members.push(member)
    periode.members.push(member)
    
    // Store image in correct format as array with url and filename
    if (image) {
        member.image = [{
            url: `/image/member/${image.filename}`,
            filename: image.filename
        }];
    }
    
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

// module.exports.update = async (req, res) => {
//     const {id} = req.params
//     const member = await Member.findByIdAndUpdate(id, {...req.body.member})
//     if(req.files && req.files.length > 0) {
//         member.image.forEach(image => {
//             fs.unlinkSync(image.url)
//         })
//         const image = req.files.map(file => ({url: file.path, filename: file.filename}))
//         member.image = image
//         await member.save()
//     }

//     req.flash('success_msg', 'Data is successfully edited')
//     res.redirect(`/periode`)
// }


module.exports.update = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the existing Member document by ID
        const member = await Member.findByIdAndUpdate(id, { ...req.body.member});

        if (!member) {
            req.flash('error_msg', 'Member not found');
            return res.redirect('/periode');
        }

        // If new images are uploaded, replace the old images in GridFS

            // Delete the old images from GridFS if any exist
            if (member.image && member.image.length > 0) {
                await Promise.all(member.image.map(async (image) => {
                    try {
                        const file = await gridfsBucket.find({ filename: image.filename }).toArray();
                        if (file.length > 0) {
                            await gridfsBucket.delete(file[0]._id);
                            console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                        } else {
                            console.log(`Image ${image.filename} not found in GridFS.`);
                        }
                    } catch (err) {
                        console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                    }
                }));
            }

            // Add new images to GridFS and update the Member document
            if (req.file) {
                member.image = [{
                    filename: req.file.filename,
                    url: `/image/member/${req.file.filename}`
                }];
            }
        

        // Save the updated Periode document with the new image references
        await member.save();

        req.flash('success_msg', 'Data is successfully edited');
        res.redirect('/periode');
    } catch (error) {
        console.error('Error updating member:', error);
        req.flash('error_msg', 'An error occurred while updating the periode');
        res.redirect('/periode');
    }
};


module.exports.destroy = async (req, res) => {
    const {id} = req.params
    const member = await Member.findById(id)
    await Member.findByIdAndDelete(req.params.id)
    //check if the member hasnot image
    if(!member.image) {
        res.redirect('/periode')
    }
    //check if the member has image
    if(member.image && member.image.length > 0) {
        await Promise.all(member.image.map(async (image) => {
            try {
                const file = await gridfsBucket.find({filename: image.filename}).toArray()
                if(file && file.length > 0) {
                    await gridfsBucket.delete(file[0]._id)
                    console.log('file deleted')
                } else {
                    console.log('file not found')
                }

            } catch (err) {
                console.error(`Error deleting image ${image.filename} from GridFS:`, err);
            }
        }))
    } 

    req.flash('success_msg', 'Data is successfully deleted')
    // res.redirect(`/divisi/${periode_id}/${divisi_id}/show`)
    res.redirect('/periode')
}

 




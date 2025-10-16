const express = require('express')
const Divisi = require('../models/divisi')
const Periode = require('../models/periode')
const Member = require('../models/member')
const fs = require('fs')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const {MongoClient, GridFSBucket} = require('mongodb')
const mongoose = require('mongoose')

let gridfsBucketDivisi, gridfsBucketMember, gfs;

const conn = mongoose.createConnection(process.env.MONGO_URI);

conn.once('open', () => {
    gridfsBucketDivisi  = new GridFSBucket(conn.db, {bucketName: 'uploadDivisi'})     
    gridfsBucketMember  = new GridFSBucket(conn.db, {bucketName: 'uploadMember'})     

    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploadDivisi')
})



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
    const image = req.file
    const periode = await Periode.findById(periode_id)
    divisi.author = req.user._id
    
    // Store image in correct format as array with url and filename
    if (image) {
        divisi.image = [{
            url: `/image/divisi/${image.filename}`,
            filename: image.filename
        }];
    }
    
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

// module.exports.update = async (req, res) => {
//     const { id } = req.params
//     const divisi = await Divisi.findByIdAndUpdate(id, {...req.body.divisi})
//     if(req.files && req.files.length > 0 ) {
//         divisi.image.forEach(image => {
//             fs.unlinkSync(image.url)
//         })
//         const image = req.files.map(file => ({url: file.path, filename: file.filename}))
//         divisi.image = image
//     await divisi.save()
//     }
//     req.flash('success_msg', 'Data is successfully edited')
//     res.redirect(`/periode`)
// }

module.exports.update = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the existing Divisi document by ID
        const divisi = await Divisi.findByIdAndUpdate(id, {...req.body.divisi});

        if (!divisi) {
            req.flash('error_msg', 'Divisi not found');
            return res.redirect('/periode');
        }

        // If new images are uploaded, replace the old images in GridFS

            // Delete the old images from GridFS if any exist
            if (divisi.image && divisi.image.length > 0) {
                await Promise.all(divisi.image.map(async (image) => {
                    try {
                        const file = await gridfsBucketDivisi.find({ filename: image.filename }).toArray();
                        if (file.length > 0) {
                            await gridfsBucketDivisi.delete(file[0]._id);
                            console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                        } else {
                            console.log(`Image ${image.filename} not found in GridFS.`);
                        }
                    } catch (err) {
                        console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                    }
                }));
            }

            // Add new images to GridFS and update the Divisi document
            if (req.file) {
                divisi.image = [{
                    filename: req.file.filename,
                    url: `/image/divisi/${req.file.filename}`
                }];
            }
        

        // Save the updated Periode document with the new image references
        await divisi.save();

        req.flash('success_msg', 'Data is successfully edited');
        res.redirect('/periode');
    } catch (error) {
        console.error('Error updating divisi:', error);
        req.flash('error_msg', 'An error occurred while updating the periode');
        res.redirect('/periode');
    }
};

 
module.exports.destroy = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the Divisi and populate associated members
        const divisi = await Divisi.findById(id).populate('members');
        if (!divisi) {
            req.flash('error_msg', 'Divisi not found.');
            return res.redirect('/periode');
        }

        // 1. Delete associated members
        if (divisi.members && divisi.members.length > 0) {
            await Promise.all(divisi.members.map(async (member) => {
                // Delete each member
                await Member.findByIdAndDelete(member._id);

                // 2. Delete associated images of each member from GridFS
                if (member.image && member.image.length > 0) {
                    await Promise.all(member.image.map(async (image) => {
                        try {
                            const file = await gridfsBucketMember.find({ filename: image.filename }).toArray();
                            if (file && file.length > 0) {
                                await gridfsBucketMember.delete(file[0]._id);
                                console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                            } else {
                                console.log(`Image ${image.filename} not found in GridFS.`);
                            }
                        } catch (err) {
                            console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                        }
                    }));
                }
            }));
        }

        // 3. Delete Divisi's associated images from GridFS
        if (divisi.image && divisi.image.length > 0) {
            await Promise.all(divisi.image.map(async (image) => {
                try {
                    const file = await gridfsBucketDivisi.find({ filename: image.filename }).toArray();
                    if (file && file.length > 0) {
                        await gridfsBucketDivisi.delete(file[0]._id);
                        console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                    } else {
                        console.log(`Image ${image.filename} not found in GridFS.`);
                    }
                } catch (err) {
                    console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                }
            }));
        }

        // 4. Delete the Divisi itself
        await Divisi.findByIdAndDelete(id);

        req.flash('success_msg', 'Divisi and associated members deleted successfully.');
        res.redirect('/periode');
    } catch (err) {
        console.error('Error deleting divisi:', err);
        req.flash('error_msg', 'Error deleting divisi.');
        res.redirect('/periode');
    }
};





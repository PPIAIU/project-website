const Periode = require('../models/periode')
const Member = require('../models/member')
const Divisi = require('../models/divisi')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const fs = require('fs')
const {GridFsStorage} = require('multer-gridfs-storage')
const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();
let gfs, gridfsBucketPeriode, gridfsBucketDivisi, gridfsBucketMember;


// Create a single connection to MongoDB
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1/ppiaiu';
const conn = mongoose.createConnection(mongoURI);

conn.once('open', () => {
    console.log('MongoDB connection opened.');

    // Initialize GridFSBucket
    gridfsBucketPeriode = new GridFSBucket(conn.db, { bucketName: 'uploadPeriode' });
    gridfsBucketDivisi = new GridFSBucket(conn.db, { bucketName: 'uploadDivisi' });
    gridfsBucketMember = new GridFSBucket(conn.db, { bucketName: 'uploadMember' });
    // Initialize GridFS stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploadPeriode');

    console.log('GridFS stream initialized.');
});

conn.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});


module.exports.index = async (req, res) => {
    const periodes = await Periode.find()
    console.log('Found periodes:', periodes)
    periodes.forEach(periode => {
        console.log(`Periode ${periode.name}:`, periode.image)
    })
    res.render('periode/index', {periodes})
}

module.exports.create = async (req, res) => {
    res.render('periode/create')
}

module.exports.store = async (req, res) => {
    try {
        const image = req.file
        console.log('Uploaded file:', image)
        
        const periode = new Periode(req.body.periode)
        periode.author = req.user._id
        
        // Store image in correct format as array with url and filename
        if (image) {
            periode.image = [{
                url: `/image/periode/${image.filename}`,
                filename: image.filename
            }];
            console.log('Image stored as:', periode.image)
        } else {
            console.log('No image uploaded')
        }
        
        console.log('Saving periode:', periode)
        await periode.save()
        console.log('Periode saved successfully')
        req.flash('success_msg', 'Board period created successfully!')
        res.redirect('/periode')
    } catch (error) {
        console.error('Error saving periode:', error)
        req.flash('error_msg', 'Failed to create board period: ' + error.message)
        res.redirect('/periode/create')
    }
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
    const { id } = req.params;

    try {
        // Find the existing Periode document by ID
        const periode = await Periode.findByIdAndUpdate(id, {...req.body.periode}); 

        if (!periode) {
            req.flash('error_msg', 'Periode not found');
            return res.redirect('/periode');
        }

        // If new images are uploaded, replace the old images in GridFS

            // Delete the old images from GridFS if any exist
            if (periode.image && periode.image.length > 0) {
                await Promise.all(periode.image.map(async (image) => {
                    try {
                        const file = await gridfsBucketPeriode.find({ filename: image.filename }).toArray();
                        if (file.length > 0) {
                            await gridfsBucketPeriode.delete(file[0]._id);
                            console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                        } else {
                            console.log(`Image ${image.filename} not found in GridFS.`);
                        }
                    } catch (err) {
                        console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                    }
                }));
            }

            // Add new images to GridFS and update the Periode document
            if (req.file) {
                periode.image = [{
                    filename: req.file.filename,
                    url: `/image/periode/${req.file.filename}`
                }];
            }
        

        // Save the updated Periode document with the new image references
        await periode.save();

        req.flash('success_msg', 'Data is successfully edited');
        res.redirect('/periode');
    } catch (error) {
        console.error('Error updating periode:', error);
        req.flash('error_msg', 'An error occurred while updating the periode');
        res.redirect('/periode');
    }
};

module.exports.destroy = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the Periode document by ID
        const periode = await Periode.findById(id).populate('divisis').populate('members');
        if (!periode) {
            req.flash('error_msg', 'Periode not found');
            return res.redirect('/periode');
        }

        // 1. Delete associated members and their images
        if (periode.members && periode.members.length > 0) {
            await Promise.all(periode.members.map(async (member) => {
                console.log(`Processing member: ${member._id}`);

                // Delete each member document
                await Member.findByIdAndDelete(member._id);

                // Delete associated images of each member from GridFS
                if (member.image && member.image.length > 0) {
                    await Promise.all(member.image.map(async (image) => {
                        try {
                            const file = await gridfsBucketMember.find({ filename: image.filename }).toArray();
                            if (file.length > 0) {
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

        // 2. Delete associated divisis and their images
        if (periode.divisis && periode.divisis.length > 0) {
            await Promise.all(periode.divisis.map(async (divisi) => {
                console.log(`Processing divisi: ${divisi._id}`);

                // Delete each divisi document
                await Divisi.findByIdAndDelete(divisi._id);

                // Delete associated images of each divisi from GridFS
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
            }));
        }

        // 3. Delete images associated with the Periode from GridFS
        if (periode.image && periode.image.length > 0) {
            await Promise.all(periode.image.map(async (image) => {
                try {
                    const file = await gridfsBucketPeriode.find({ filename: image.filename }).toArray();
                    if (file.length > 0) {
                        await gridfsBucketPeriode.delete(file[0]._id);
                        console.log(`Image ${image.filename} deleted successfully from GridFS.`);
                    } else {
                        console.log(`Image ${image.filename} not found in GridFS.`);
                    }
                } catch (err) {
                    console.error(`Error deleting image ${image.filename} from GridFS:`, err);
                }
            }));
        }

        // 4. Delete the Periode document itself
        await Periode.findByIdAndDelete(id);

        req.flash('success_msg', 'Periode and associated data deleted successfully');
        res.redirect('/periode');
    } catch (error) {
        console.error('Error deleting periode:', error);
        req.flash('error_msg', 'An error occurred while deleting the periode');
        res.redirect('/periode');
    }
};

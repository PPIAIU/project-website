const multer = require('multer')
const path = require('path')
// const ErrorHandler = require('../utils/ErrorHandler')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/member/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // format nama file
    }   
})


const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // fungsi untuk memeriksa format file yang diizinkan
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'));
        }
    }
});


module.exports = upload;
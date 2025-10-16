// const multer = require('multer')
// const path = require('path')
// // const ErrorHandler = require('../utils/ErrorHandler')


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/member/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // format nama file
//     }   
// })


// const upload = multer({
//     storage: storage,
//     fileFilter: function (req, file, cb) {
//         // fungsi untuk memeriksa format file yang diizinkan
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only images are allowed.'));
//         }
//     }
// });


// module.exports = upload;



//setting multer gridfs storage
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const {GridFsStorage} = require('multer-gridfs-storage');
require('dotenv').config();
if (!process.env.MONGO_URI) {
	throw new Error('MONGO_URI is not set. Please create a .env file or set the environment variable MONGO_URI');
}
mongoose.connect(process.env.MONGO_URI);
// const connection = mongoose.connection;
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploadMember'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });
module.exports = upload;



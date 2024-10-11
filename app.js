const express = require('express')
const gsap = require('gsap')
const bodyParser = require('body-parser');
const crypto = require('crypto')
const multer = require('multer')
const Grid = require('gridfs-stream')
const {GridFsStorage} = require('multer-gridfs-storage');
const joi = require('joi')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
//ejsmate for ejs file engine
const ejsMate = require('ejs-mate')
//method override for put and delete in ejs file
const methodOverride = require('method-override')
//error handler for error handler
//Authentication
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ErrorHandler = require('./utils/ErrorHandler')
//npm for session
const session = require('express-session')
//npm for connect-flash
const flash = require('connect-flash')
//user
const User = require('./models/user.js')
const { constants } = require('fs')
const wrapAsync = require('./utils/wrapAsync.js')
const { MongoClient, GridFSBucket } = require('mongodb');
//dotenv for enviroment variable
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
// view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
//to make able sendingg data usiingg url
app.use(express.urlencoded({extended: true}))
//method override 
app.use(methodOverride('_method'))
//for sendingg json file 
app.use(express.json())
//session
app.use(session({
	secret: 'secret-key-for-web',
	resave: false,
	saveUninitialized: false,
	cookie: { 
		httpOnly: true ,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
		maxAge: 1000 * 60 * 60 * 24 * 7

	}

}))
//setting  flash message
app.use(flash())

//setting passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// app.use(express.static( './public'))

//setting current user must after passport
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	next()
})
let gfs, gridfsBucketPeriode, gridfsBucketDivisi, gridfsBucketMember;;


// connect to the database server
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
})
    .then((conn) => {
        console.log('Connected to MongoDB');
        const db = conn.connection.db;
        gridfsBucketPeriode = new GridFSBucket(db, { bucketName: 'uploadPeriode' });
        gridfsBucketDivisi = new GridFSBucket(db, { bucketName: 'uploadDivisi'});
        gridfsBucketMember = new GridFSBucket(db, { bucketName: 'uploadMember' });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
  
var conn = mongoose.createConnection(process.env.MONGO_URI );
//init gfs

// Initialize the GridFSBucket

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploadPeriode');
    console.log('GridFS stream initialized.');
});
// // connect to mongodb
// mongoose.connect('mongodb://127.0.0.1/ppiaiu')
// 	.then((result) => {
// 		console.log('connected to mongodb')
// 	}).catch((err) => {
// 		console.log(err)
// 	});
app.get('/files', async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found' });
        }

        // Respond with the array of files
        res.status(200).json(files);
    } catch (err) {
        console.error('Error retrieving files:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Retrieve and display images

app.get('/image/member/:filename', async (req, res) => {
    try {
        const fileCursor = gridfsBucketMember.find({ filename: req.params.filename });
        const files = await fileCursor.toArray();

        // Check if the file exists
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }

        const fileData = files[0]; // Get the first matched file
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        
        // Check if the file is an image
        if (validImageTypes.includes(fileData.contentType)) {
            res.set('Content-Type', fileData.contentType);

            // Create a read stream and pipe it to the response
            const readstream = gridfsBucketMember.openDownloadStreamByName(req.params.filename);
            readstream.pipe(res);

            // Handle stream errors
            readstream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).json({ message: 'Error streaming image' });
            });
        } else {
            res.status(400).json({ message: 'File is not an image' });
        }
    } catch (error) {
        console.error('Error retrieving file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/image/divisi/:filename', async (req, res) => {
    try {
        const fileCursor = gridfsBucketDivisi.find({ filename: req.params.filename });
        const files = await fileCursor.toArray();

        // Check if the file exists
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }

        const fileData = files[0]; // Get the first matched file
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        
        // Check if the file is an image
        if (validImageTypes.includes(fileData.contentType)) {
            res.set('Content-Type', fileData.contentType);

            // Create a read stream and pipe it to the response
            const readstream = gridfsBucketDivisi.openDownloadStreamByName(req.params.filename);
            readstream.pipe(res);

            // Handle stream errors
            readstream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).json({ message: 'Error streaming image' });
            });
        } else {
            res.status(400).json({ message: 'File is not an image' });
        }
    } catch (error) {
        console.error('Error retrieving file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/image/periode/:filename', async (req, res) => {
    try {
        const fileCursor = gridfsBucketPeriode.find({ filename: req.params.filename });
        const files = await fileCursor.toArray();

        // Check if the file exists
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }

        const fileData = files[0]; // Get the first matched file
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        
        // Check if the file is an image
        if (validImageTypes.includes(fileData.contentType)) {
            res.set('Content-Type', fileData.contentType);

            // Create a read stream and pipe it to the response
            const readstream = gridfsBucketPeriode.openDownloadStreamByName(req.params.filename);
            readstream.pipe(res);

            // Handle stream errors
            readstream.on('error', (err) => {
                console.error('Error streaming file:', err);
                res.status(500).json({ message: 'Error streaming image' });
            });
        } else {
            res.status(400).json({ message: 'File is not an image' });
        }
    } catch (error) {
        console.error('Error retrieving file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/image/:filename', async (req, res) => {
    try {
        const file = await gridfsBucket.find({ filename: req.params.filename }).toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }

        // Delete the file by its ObjectId
        await gridfsBucket.delete(file[0]._id);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// ngambil routes di folder routes
app.use('/member', require('./routes/member.js'))
app.use('/divisi', require('./routes/divisi.js'))
app.use('/periode', require('./routes/periode.js'))
app.use('', require('./routes/auth.js'))
app.use('/blog', require('./routes/blog.js'))


//direct webpage

app.get('/foundation', async (req, res) => {
	res.render('fondasi')
})
app.get('/blog', async (req, res) => {
	res.render('blog')
})
app.get('/home', async (req, res) => {
	res.render('home')
})
app.get('/developer', async (req, res) => {
	res.render('developer')
})
app.get('/', ((req, res) => {
	res.render('welcome')
  }))

app.all('*', (req, res, next) => {
	next(new ErrorHandler('page is not found', 405))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error', {err})
})

// connect to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//localhost connect
// const PORT = 3000;
// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
//   });


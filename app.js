const express = require('express')
const gsap = require('gsap')
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
//dotenv for enviroment variable
require('dotenv').config();

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

//connect to the database server
mongoose.connect(process.env.MONGO_URI,{
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    connectTimeoutMS: 30000
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));
  


// connect to mongodb
// mongoose.connect('mongodb://127.0.0.1/ppiaiu')
// 	.then((result) => {
// 		console.log('connected to mongodb')
// 	}).catch((err) => {
// 		console.log(err)
// 	});

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




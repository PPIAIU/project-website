const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')


// view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.json())
// app.use(express.static( './public'))



// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/ppiaiu')
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});

// ngambil routes di folder routes
app.use('/member', require('./routes/member.js'))
app.use('/divisi', require('./routes/divisi.js'))
app.use('/periode', require('./routes/periode.js'))


app.get('/home', ((req, res) => {
	res.render('home')
  }))



app.listen(2000, () => {
    console.log((`Server is running on http://127.0.0.1:2000`))
})


const express = require('express')
const { connect } = require('http2')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')



app.get('/', ((req, res) => {
  res.render('home')
}))

// view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}))

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/ppiaiu')
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});


app.use('/member', require('./routes/member.js'))
app.use('/divisi', require('./routes/divisi.js'))
app.use('/periode', require('./routes/periode.js'))


app.listen(2000, () => {
    console.log((`Server is running on http://127.0.0.1:2000`))
})



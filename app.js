const express = require('express')
const { connect } = require('http2')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const {routerUser} = require('./routes/Users.js')



app.get('/', ((req, res) => {
  res.render('home')
}))
// view engine
app.engine('ejs', ejs-Mate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/ppiaiu')
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});


app.use('/user', router )

app.listen(2000, () => {
    console.log((`Server is running on http://127.0.0.1:2000`))
})



//connect to mongodb

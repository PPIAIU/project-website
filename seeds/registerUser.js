
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('../models/user.js')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    connectTimeoutMS: 30000
  })
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});


const newUser = async (req, res) => {
    try {
        const user = new User({
            email: 'zulfanisious20@gmail.com',
            username: 'zulfan'
        })
        const userNew = await User.register(user, 'secretBU2024')
        await userNew.save()
        console.log(userNew)
    } catch (error) {
        console.log('Terjadi kesalahan saat menyimpan data:', error);
    } finally 
    {
       mongoose.disconnect()
    }
}

newUser()

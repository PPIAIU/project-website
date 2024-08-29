
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('../models/user.js')

mongoose.connect('mongodb://127.0.0.1/ppiaiu')
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

const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('../models/user.js')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});

const createAriaAdmin = async () => {
    try {
        // Set expiry date 6 months from now
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 6)
        
        const user = new User({
            email: 'aria.firmansyah@student.aiu.edu.my',
            username: 'aria_temp',
            role: 'temp_admin',
            expiryDate: expiryDate,
            createdBy: 'zulfan',
            isActive: true
        })
        const userNew = await User.register(user, 'ARIA_TEMP_2025')
        await userNew.save()
        console.log('✅ Temporary Admin created successfully!')
        console.log('📋 Login credentials:')
        console.log('   Username: aria_temp')
        console.log('   Password: ARIA_TEMP_2025')
        console.log('   Email: aria.firmansyah@student.aiu.edu.my')
        console.log('   Role: temp_admin')
        console.log('   Expires: ' + expiryDate.toDateString())
        console.log('   Created by: zulfan')
        console.log('')
        console.log('🗑️  To delete this account later, run: node seeds/deleteUser.js aria_temp')
    } catch (error) {
        if (error.name === 'UserExistsError') {
            console.log('❌ User already exists. Please use different username.')
        } else {
            console.log('❌ Error creating user:', error);
        }
    } finally {
       mongoose.disconnect()
    }
}

createAriaAdmin()
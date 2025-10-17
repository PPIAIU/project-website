const mongoose = require('mongoose')
const User = require('../models/user.js')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});

const listUsers = async () => {
    try {
        const users = await User.find({})
        
        console.log('👥 All Admin Users:')
        console.log('=' .repeat(50))
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Username: ${user.username}`)
            console.log(`   Email: ${user.email}`)
            console.log(`   Role: ${user.role || 'admin'}`)
            console.log(`   Active: ${user.isActive !== false ? '✅' : '❌'}`)
            console.log(`   Created: ${user.createdAt}`)
            
            if (user.expiryDate) {
                const isExpired = new Date() > user.expiryDate
                console.log(`   Expires: ${user.expiryDate} ${isExpired ? '(EXPIRED)' : ''}`)
            }
            
            if (user.createdBy) {
                console.log(`   Created by: ${user.createdBy}`)
            }
            console.log('')
        })
        
        console.log(`Total users: ${users.length}`)
        
    } catch (error) {
        console.log('❌ Error listing users:', error);
    } finally {
       mongoose.disconnect()
    }
}

listUsers()
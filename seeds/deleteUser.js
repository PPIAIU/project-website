const mongoose = require('mongoose')
const User = require('../models/user.js')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});

const deleteUser = async () => {
    try {
        const username = process.argv[2]
        
        if (!username) {
            console.log('❌ Please provide username to delete')
            console.log('Usage: node deleteUser.js <username>')
            return
        }

        const user = await User.findOne({ username: username })
        
        if (!user) {
            console.log(`❌ User '${username}' not found`)
            return
        }

        // Show user info before deleting
        console.log('👤 User to delete:')
        console.log(`   Username: ${user.username}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role || 'admin'}`)
        console.log(`   Created: ${user.createdAt}`)
        
        if (user.expiryDate) {
            console.log(`   Expires: ${user.expiryDate}`)
        }

        // Delete the user
        await User.findOneAndDelete({ username: username })
        console.log(`✅ User '${username}' deleted successfully!`)
        
    } catch (error) {
        console.log('❌ Error deleting user:', error);
    } finally {
       mongoose.disconnect()
    }
}

deleteUser()
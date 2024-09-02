const mongoose = require('mongoose')
const Member = require('./member')
const User = require('./user')
const Schema = mongoose.Schema


const divisiSchema = new Schema({
    name: String,
    deskripsi: String,
    image: [
        {
        url: String,
        filename: String
    }
],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [ {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }]
})

divisiSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        const res = await Member.deleteMany({_id : { $in : doc.members}})

        console.log(res)
    }
})

module.exports = mongoose.model('Divisi', divisiSchema)
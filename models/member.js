const mongoose = require('mongoose')
const User = require('./user')

const Schema  = mongoose.Schema

const memberSchema = new Schema({
    name: String,
    jabatan: String,
    background: String,
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

    // images: [
    //     {
    //         url: String,
    //         filename: String
    //     }
    // ]
})



module.exports = mongoose.model('Member', memberSchema)
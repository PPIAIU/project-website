const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const memberSchema = new Schema({
    name: String,
    jabatan: String,
    background: String,
    // images: [
    //     {
    //         url: String,
    //         filename: String
    //     }
    // ]
})



module.exports = mongoose.model('Member', memberSchema)
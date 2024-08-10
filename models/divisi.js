const mongoose = require('mongoose')
const Schema = mongoose.Schema

const divisiSchema = new Schema({
    name: String,
    deskripsi: String,
})

module.exports = mongoose.model('Divisi', divisiSchema)
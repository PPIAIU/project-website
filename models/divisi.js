const mongoose = require('mongoose')
const Schema = mongoose.Schema

const divisiSchema = new Schema({
    name: String,
    deskripsi: String,
    members: [ {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }]
})

module.exports = mongoose.model('Divisi', divisiSchema)
const mongoose = require('mongoose')
const Divisi = require('./divisi')
const Schema = mongoose.Schema

const periodeSchema = new Schema({
    name: String,
    divisis: [{
        type: Schema.Types.ObjectId,
        ref: 'Divisi'
    }],
})

module.exports = mongoose.model('Periode', periodeSchema)
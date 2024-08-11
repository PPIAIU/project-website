const mongoose = require('mongoose')
const Schema = mongoose.Schema

const periodeSchema = new Schema({
    name: String,
    divisi: [{
        type: Schema.Types.ObjectId,
        ref: 'Divisi'
    }],
})

module.exports = mongoose.model('Periode', periodeSchema)
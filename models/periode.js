const mongoose = require('mongoose')
const Schema = mongoose.Schema

const periodeSchema = new Schema({
    name: String,
    divisi: {
        type: Schema.Types.ObjectId,
        ref: 'Divisi'
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }
})

module.exports = mongoose.model('Periode', periodeSchema)
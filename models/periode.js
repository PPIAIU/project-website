const mongoose = require('mongoose')
const Divisi = require('./divisi')
const Member = require('./member')
const divisi = require('./divisi')
const User = require('./user')

const Schema = mongoose.Schema

const periodeSchema = new Schema({
    name: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    divisis: [{
        type: Schema.Types.ObjectId,
        ref: 'Divisi'
    }],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Member'
        }
    ]
})

periodeSchema.post('findOneAndDelete', async function (periode) {
    if(periode){
        const res1 = await Divisi.deleteMany({ _id : { $in : periode.divisis} })
        const res2 = await Member.deleteMany({ _id : { $in : periode.members } })
        console.log(res1)
        console.log(res2)
    }
})


module.exports = mongoose.model('Periode', periodeSchema)
const mongoose = require('mongoose')
const Divisi = require('./divisi')
const Member = require('./member')
const divisi = require('./divisi')
const Schema = mongoose.Schema

const periodeSchema = new Schema({
    name: String,
    divisis: [{
        type: Schema.Types.ObjectId,
        ref: 'Divisi'
    }],
    members: [
        {
            type: Schema.Types.ObjectId,
            reef: 'Member'
        }
    ]
})

periodeSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        const res1 = await Divisi.deleteMany({ _id : { $in : doc.divisis} })
        const res2 = await Member.deleteMany({ _id : { $in : doc.members }  })
        console.log(res1)
        console.log(res2)
    }
})


module.exports = mongoose.model('Periode', periodeSchema)
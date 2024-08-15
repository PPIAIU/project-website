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
})

periodeSchema.post('findOneAndDelete', async function (divisis) {
    if(periode.divisis.lenght){
        const res1 = await Divisi.deleteMany({ _id : { $in : periode.divisis} })
        const res2 = await Member.deleteMany({ _id : { $in : divisi.members }  })
        console.log(res1)
    }
})


module.exports = mongoose.model('Periode', periodeSchema)
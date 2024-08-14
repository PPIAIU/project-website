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

periodeSchema.post('findOneAndDelete', async function (divisis) {
    if(periode.divisis.lenght){
        const res = await Divisi.deleteMany({ _id : { $in : periode.divisis} })
        console.log(res)
    }
})


module.exports = mongoose.model('Periode', periodeSchema)
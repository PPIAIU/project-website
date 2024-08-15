const mongoose = require('mongoose')
const Member = require('./member')
const Schema = mongoose.Schema


const divisiSchema = new Schema({
    name: String,
    deskripsi: String,
    members: [ {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }]
})

divisiSchema.post('findOneAndDelete', async function (members) {
    if(divisi.members.length) {
        const res = await Member.deleteMany({_id : { $in : divisi.members}})
        console.log(res)
    }
})

module.exports = mongoose.model('Divisi', divisiSchema)
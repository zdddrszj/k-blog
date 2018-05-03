

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let SequenceSchema = new Schema({
  key: {
    unique: true,
    required: true,
    type: String
  },
  value: {
    type: Number, 
    required: true,
    get: v => parseInt(v),
    set: v => parseInt(v),
    default: 0
  }
},
{
  versionKey: false
})

let Sequence = mongoose.model('Sequence', SequenceSchema, 'sequence')

module.exports = Sequence
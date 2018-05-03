let mongoose = require('mongoose')
let Sequence = mongoose.model('Sequence')

async function getNextSequenceValue (sequenceName) {
  let sequenceDocument = await Sequence.findOneAndUpdate({
    key: sequenceName
  }, {
    $inc:{ value: 1 }
  }, {
    "new": true,
    "upsert": true // 没有该表创建
  }).exec()
  return sequenceDocument.value
}

module.exports = {
  getNextSequenceValue
}
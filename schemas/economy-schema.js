const mongoose = require('mongoose')

const itemString = {
  type: Number,
  default: 0
}

const profileSchema = mongoose.Schema({
  _id: String,
  XP: itemString,
  level: itemString,

  bronzeCoins: itemString,
  silverCoins: itemString,
  goldCoins: itemString,

  goldIngot: itemString,
  silverIngot: itemString,

  fishingRod: itemString,
  trident: itemString,
  trishard: itemString,
  rifle: itemString,
  pickaxe: itemString,

  fish: itemString,
  raccoon: itemString,
  rabbit: itemString,

  bronzeKey: itemString,
  silverKey: itemString,
  goldKey: itemString,

  
  bronzeLock: itemString,
  silverLock: itemString,
  goldLock: itemString,

})

module.exports = mongoose.model('economy', profileSchema)
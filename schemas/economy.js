const economySchema = require('./economy-schema')


module.exports = (client) => { }

module.exports.getInv = async (userId, itemName) => {
  const Update = {}
  Update[itemName] = 0
  const result = await economySchema.findByIdAndUpdate(userId, {}, { new: true, upsert: true, setDefaultsOnInsert: true });

  return result[itemName]
}

module.exports.buyItem = async (userId, itemName, amount) => {
  const update = {}
  update[itemName] = amount
  const result = await economySchema.findByIdAndUpdate(userId, { $inc: update }, { new: true, upsert: true, setDefaultsOnInsert: true });

  return result[itemName]
}
const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const reqString = {
    type: String,
    required: true
}

const levelSchema = Schema({
    _id: String,
    roleMultiplier: {},
    channelMultiplier: {},
    roleLevel: {},
    guildMultiplier: { type: Number, default: 1 },
    blacklistedRoles: Array,
    blacklistedChannels: Array,
    levelUp: Boolean,
    levelUpType: String,
    levelUpPings: Boolean
});

module.exports = model('levelSchema', levelSchema)
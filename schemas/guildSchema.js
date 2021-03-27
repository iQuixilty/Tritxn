const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const guildSchema = Schema({
    _id: String,
    prefix: {
        default: PREFIX,
        type: String
    },
    mutedRole: String,
    mutes: Array,
    timeoutRole: String,
    disabledCommands: Array,
    disabledChannels: Array,
    disabledWords: Array,
    commandPerms: {},
    commandCooldowns: {},
    commandAlias: {},
});

module.exports = model('guildSchema', guildSchema)
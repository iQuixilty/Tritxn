const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const normalString = {
    default: 'Enabled',
    type: String,
}

const auditLogSchema = Schema({
    _id: String,
    messageDelete: normalString,
    messageUpdate: normalString,
    messageDeleteBulk: normalString,
    guildMemberAdd: normalString,
    guildMemberRemove: normalString,
    guildMemberUpdate: normalString,
    channelCreate: normalString,
    channelDelete: normalString,
    guildBanAdd: normalString,
    guildBanRemove: normalString,
    roleCreate: normalString,
    roleDelete: normalString,
    roleUpdate: normalString,
    voiceStateUpdate: normalString,
});

module.exports = model('auditLogSchema', auditLogSchema)
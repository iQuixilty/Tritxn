const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const reqString = {
    type: String,
    required: true
}

const guildSettingsSchema = Schema({
    _id: String,
    ghostPing: {
        default: 'Enabled',
        type: String
    },
    decancer: {
        default: 'Disabled',
        type: String
    },
    ignoreChannelId: {
        type: [Object],
        required: true
    },
    autoRoleId: reqString,
    welcomeChannelId: reqString,
    welcomeChannelText: reqString,
    leaveChannelId: reqString,
    leaveChannelText: reqString,
    auditLogChannelId: reqString,
});

module.exports = model('guildSettingsSchema', guildSettingsSchema)
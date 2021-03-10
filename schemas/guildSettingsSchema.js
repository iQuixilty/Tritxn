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
        type: Boolean
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
    antiSpam: {
        default: true,
        type: Boolean
    },
    antiSpamAmount: {
        default: 5,
        type: Number,
    },
    antiSpamTimeout: {
        default: 5000,
        type: Number
    }
});

module.exports = model('guildSettingsSchema', guildSettingsSchema)
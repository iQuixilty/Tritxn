const mongoose = require('mongoose')

const modLogSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    modlogs: {
        type: [Object],
        required: true
    }
})

module.exports = mongoose.model('modlogs', modLogSchema)
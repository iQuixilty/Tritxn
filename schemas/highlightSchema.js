const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const highlightSchema = Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    highlightedWords: Array,
});

module.exports = model('highlightSchema', highlightSchema)
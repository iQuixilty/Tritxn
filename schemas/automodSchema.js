const { Schema, model } = require('mongoose');
const { PREFIX } = require('../config/config.json')

const autoModSchema = Schema({
    guildId: {
        type: String,
        required: true
    },
    warnAutomod: {},
    modlogAutomod: {},

});

module.exports = model('autoMod', autoModSchema)
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: String,
    playlists: {
        type: [Object],
        required: true
    },
    savedCooldowns: {},    
})

module.exports = mongoose.model('userSchema', userSchema)
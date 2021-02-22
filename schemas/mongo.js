const mongoose = require('mongoose')
const { MONGODB_URI } = require('../config/config.json')

//J0sreAJINKRHwck5
//mongodb+srv://Tritxn:J0sreAJINKRHwck5@tritxncluster.6bpla.mongodb.net/trixtn-db?retryWrites=true&w=majority

module.exports = async () => {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        keepAlive: true,
    })
    return mongoose;
}

const mongoose = require('mongoose')

const logoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
    },
    count: {
        type: Number,
        default: 0
    }
})

const Logo = mongoose.model('logos', logoSchema)

module.exports = Logo
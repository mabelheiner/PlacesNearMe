const mongoose = require('mongoose')

const logoSchema = mongoose.Schema({
    name: {
        type: [String],
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
})

const Logo = mongoose.model('logos', logoSchema)

module.exports = Logo
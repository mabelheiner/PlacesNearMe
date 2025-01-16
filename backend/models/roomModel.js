const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    publicId: {
        type: Number,
        required: true
    },
    restaurantList: {
        type: [String],
    }
})
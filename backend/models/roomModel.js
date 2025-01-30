const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    publicId: {
        type: Number,
        required: true
    },
    restaurantList: {
        type: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: false,
        },
        lng: {
            type: Number,
            required: false,
        }}]
    }
}, {timestamps: true})

const Room = mongoose.model('room', roomSchema)

module.exports = Room;
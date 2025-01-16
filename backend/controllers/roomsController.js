const Room = require('../models/roomModel')

const getAllRooms = async (req, res) => {
    res.json('get all rooms')
}

const getRoomById = async (req, res) => {
    res.json('get room by id')
}

const addRoom = async (req, res) => {
    res.json('add room') //generate shareable id
}

const updateRoom = async (req, res) => {
    res.json('update room')
}

const deleteRoom = async (req, res) => {
    res.json('delete room')
}

module.exports = {
    getAllRooms,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom
}
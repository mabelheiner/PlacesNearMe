const Room = require('../models/roomModel')

const getAllRooms = async (req, res) => {
    res.json('get all rooms')
}

const getRoomById = async (req, res) => {
    res.json('get room by id')
}

const addRoom = async (req, res) => {
    //generate shareable id
    console.log('Req.body received', req.body)
    res.status(200).json({message: 'Room Added'})
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
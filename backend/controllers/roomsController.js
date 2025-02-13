const Room = require('../models/roomModel')

const getAllRooms = async (req, res) => {
    const rooms = await Room.find({})
    res.status(200).json(rooms)
}

const getRoomById = async (req, res) => {
    console.log('Req received', req.params)
    const room = await Room.find({publicId: req.params.id})
    console.log('Room', room)
    if (room.length !== 0) {
        res.status(200).json(room)
    } else {
        res.status(401).json({message: 'Cannot find room'})
    }
}

const addRoom = async (req, res) => {
    console.log('Req.body received', req.body)
    const room = {
        publicId: req.body.publicId,
        restaurantList: req.body.restaurantList,
        filter: req.body.filter
    }

    try {
        const newRoom = new Room(room)
        await newRoom.save()

        console.log('New room created')
        res.status(201).json({room: newRoom})
    } catch (error) {
        console.log('Error', error)
        res.status(400).json({error: error, message: 'Room cannot be added'})
    }

    /* res.status(200).json({message: 'Room Added'}) */
}

const updateRoom = async (req, res) => {
    res.json('update room')
}

const deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.deleteOne({publicId: req.params.id})
        if (deletedRoom.deletedCount === 1) {
            res.status(200).json({message: 'Room deleted'})
        } else {
            res.status(404).json({message: 'No room to delete'})
        }
    } catch (error) {
        console.log('Error', error)
        res.status(400).json({message: 'An eror occured while deleting the room.'})
    }
}

module.exports = {
    getAllRooms,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom
}
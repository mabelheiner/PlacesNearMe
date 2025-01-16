const express = require('express')
const router = express.Router()

const roomsController = require('../controllers/roomsController')

router.get('/', roomsController.getAllRooms)
router.get('/:id', roomsController.getRoomById)
router.post('/', roomsController.addRoom)
router.patch('/:id', roomsController.updateRoom)
router.delete('/:id', roomsController.deleteRoom)

module.exports = router
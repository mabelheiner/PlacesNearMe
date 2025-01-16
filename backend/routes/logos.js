const express = require('express')
const router = express.Router()

const logosController = require('../controllers/logosController')

router.get('/', logosController.getAllLogos)
router.get('/:name', logosController.getLogoByName)
router.post('/', logosController.addLogo)
router.patch('/:id', logosController.updateLogo)
router.delete('/:id', logosController.deleteLogo)

module.exports = router
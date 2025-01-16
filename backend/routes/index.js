const express = require('express')
const router = express.Router()

router.use('/logos', require('./logos'))
router.use('/rooms', require('./rooms'))

module.exports = router;
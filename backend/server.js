const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_DATABASE_URI)

app.use(cors())
app.use(express.json())

app.use('/', require('./routes/index.js'))

app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port: ${PORT}`)
})
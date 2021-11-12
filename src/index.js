require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001

require('./dataBase/config')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRoutes = require('./routes/user.routes')
app.use('/api/user', userRoutes)

app.listen(port, () => {
    console.log('Serven Back Levantado en pueto: ', port);
})

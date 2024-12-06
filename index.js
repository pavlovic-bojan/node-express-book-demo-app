require('dotenv').config()
const express = require('express')
const { conToDB } = require('./src/config/db')
const { startServerAPI } = require('./src/config/StartServer')
const mainRoutes = require('./src/api/routes')
const errorHandler = require('./src/api/middleware/ErrorHandler')
const { setupSwagger } = require('./src/config/SwaggerConfig')

const app = express();

(async () => {
    try {
        await conToDB()
        app.use(express.json())
        app.use('/api', mainRoutes)
        setupSwagger(app)
        app.use(errorHandler)
        startServerAPI(app)
    } catch (err) {
        console.error('Application failed to start:', err.message)
        process.exit(1)
    }
})()

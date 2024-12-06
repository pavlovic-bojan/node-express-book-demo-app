const mongoose = require('mongoose')
require('dotenv').config()

async function conToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log('Connected to MongoDB!')
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message)
        process.exit(1)
    }

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message)
    })
}

module.exports = { conToDB }
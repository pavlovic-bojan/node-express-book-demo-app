const express = require('express')
const router = express.Router()

// Import your route files
const AuthorRoute = require('./AuthorRoute')
const BookRoute = require('./BookRoute')
const UserRoute = require('./UserRoute')
const authenticateAndAuthorize = require("../middleware/AuthenticateAndAuthorize");

// Mount individual routes
router.use('/authors', authenticateAndAuthorize(['admin', 'client']), AuthorRoute)
router.use('/books', authenticateAndAuthorize(['admin', 'client']), BookRoute)
router.use('/users', UserRoute)

module.exports = router

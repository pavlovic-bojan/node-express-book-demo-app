const { validateCreateAuthor } = require('../validations/Validation')
const AuthorService = require("../services/AuthorService")
const createError = require('http-errors')
const logger = require('../../config/logger')

// Insert author
const insertAuthor = async (req, res, next) => {
    try {
        const authorData = req.body
        validateCreateAuthor(authorData)

        const savedAuthor = await AuthorService.createAuthor(authorData)
        res.status(201).json(savedAuthor)
        logger.info('Fetching example data') // Informational log
    } catch (error) {
        logger.error('Error fetching example data', error) // Error log
        next(error)
    }
}

// Get all authors with pagination, sorting, filtering, and optional search
const getAllAuthors = async (req, res, next) => {
    try {
        const { page, limit, sortBy, order, name, nationality, query } = req.query

        const filters = {}
        if (name) filters.name = name
        if (nationality) filters.nationality = nationality

        let authors;

        if (query) {
            authors = await AuthorService.searchAuthors(query)
        } else {
            authors = await AuthorService.getAllAuthors({
                page,
                limit,
                sortBy,
                order,
                filters,
            })
        }

        res.status(200).json(authors)
    } catch (error) {
        next(error)
    }
}

// Get author by ID
const getAuthorById = async (req, res, next) => {
    try {
        const author = await AuthorService.getAuthorWithBooks(req.params.id)
        if (!author) {
            throw createError(404, 'Author not found')
        }
        res.status(200).json(author)
    } catch (error) {
        next(error)
    }
}

// Update author
const updateAuthor = async (req, res, next) => {
    try {
        const updatedAuthor = await AuthorService.updateAuthor(req.params.id, req.body)
        if (!updatedAuthor) {
            throw createError(404, 'Author not found')
        }
        res.status(200).json(updatedAuthor)
    } catch (error) {
        next(error)
    }
}

// Replace author
const replaceAuthor = async (req, res, next) => {
    try {
        const replacedAuthor = await AuthorService.replaceAuthor(req.params.id, req.body)
        if (!replacedAuthor) {
            throw createError(404, 'Author not found')
        }
        res.status(200).json(replacedAuthor)
    } catch (error) {
        next(error)
    }
}

// Delete author by ID
const deleteAuthorById = async (req, res, next) => {
    try {
        const deleteAuthor = await AuthorService.deleteAuthor(req.params.id)
        if (!deleteAuthor) {
            throw createError(404, 'Author not found')
        }
        res.status(200).json({ message: 'Author deleted successfully' })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    insertAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    replaceAuthor,
    deleteAuthorById,
}
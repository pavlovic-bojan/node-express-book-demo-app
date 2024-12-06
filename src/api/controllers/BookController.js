const BookService = require('../services/BookService')

// Insert Book
const insertBook = async (req, res, next) => {
    try {
        const bookData = req.body
        const savedBook = await BookService.createBook(bookData)
        res.status(201).json(savedBook)
    } catch (error) {
        next(error)
    }
}

// Get all books with filters, pagination, and sorting
const getAllBooks = async (req, res, next) => {
    try {
        const queryParams = req.query
        const books = await BookService.getBooksWithFilters(queryParams)
        res.status(200).json(books)
    } catch (error) {
        next(error)
    }
}

// Get book by ID (with populated author details)
const getBookById = async (req, res, next) => {
    try {
        const bookId = req.params.id
        const book = await BookService.getBookWithAuthor(bookId)
        res.status(200).json(book)
    } catch (error) {
        next(error)
    }
}

// Delete book by ID
const deleteBookById = async (req, res, next) => {
    try {
        const bookId = req.params.id
        await BookService.deleteBook(bookId)
        res.status(200).json({ message: 'Book deleted successfully' })
    } catch (error) {
        next(error)
    }
}

// Update book (PATCH)
const updateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id
        const updates = req.body
        const updatedBook = await BookService.updateBook(bookId, updates)
        res.status(200).json(updatedBook)
    } catch (error) {
        next(error)
    }
}

// Replace book (PUT)
const replaceBook = async (req, res, next) => {
    try {
        const bookId = req.params.id
        const newBookData = req.body
        const replacedBook = await BookService.replaceBook(bookId, newBookData)
        res.status(200).json(replacedBook)
    } catch (error) {
        next(error)
    }
}

// Get aggregation data for books
const getAggregationData = async (req, res, next) => {
    try {
        const aggregationData = await BookService.getAggregationData()
        res.status(200).json(aggregationData)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    insertBook,
    getAllBooks,
    getBookById,
    deleteBookById,
    updateBook,
    replaceBook,
    getAggregationData
}

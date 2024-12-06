const mongoose = require('mongoose')
const {validateObjectId, validateCreateBook, validateUpdateBook} = require('../validations/Validation')
const Book = require('../models/BookSchema')
const Author = require('../models/AuthorSchema')
const {Types} = require("mongoose");
// const {isValidObjectId} = require("mongoose")

const createBook = async (bookData) => {
    validateCreateBook(bookData)

    const existingAuthor = await Author.findById(bookData.author)
    if (!existingAuthor) {
        throw new Error('Author not found')
    }

    const existingBook = await Book.findOne({ title: bookData.title })
    if (existingBook) {
        throw new Error('Book already exists')
    }

    const newBook = new Book(bookData)
    return await newBook.save()
}

const getBooksWithFilters = async (queryParams) => {

    const { page = 1, limit = 5, genre, minPrice, maxPrice, available, sortBy = 'title', sortOrder = 'asc' } = queryParams

    const filters = {
        genre,
        minPrice,
        maxPrice,
        available: available === 'true' ? true : available === 'false' ? false : undefined
    }

    const result = await getFilteredAndSortedBooks(Number(page), Number(limit), filters, sortBy, sortOrder)
    return result
}

const getFilteredAndSortedBooks = async (page, limit, filters, sortBy, sortOrder) => {
    const skip = (page - 1) * limit
    const query = {}

    if (filters.genre) query.genre = filters.genre
    if (filters.minPrice || filters.maxPrice) {
        query.price = {}
        if (filters.minPrice) query.price.$gte = filters.minPrice
        if (filters.maxPrice) query.price.$lte = filters.maxPrice
    }
    if (filters.available !== undefined) query.available = filters.available

    const totalBooks = await Book.countDocuments(query)

    let sort = {}
    if (sortBy === 'price') sort.price = sortOrder === 'desc' ? -1 : 1
    else if (sortBy === 'publishedDate') sort.publishedDate = sortOrder === 'desc' ? -1 : 1
    else sort = { title: 1 }

    const books = await Book.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate('author', 'name nationality')

    const totalPages = Math.ceil(totalBooks / limit)

    return {
        books,
        totalBooks,
        totalPages,
        currentPage: page,
        pageSize: limit
    }
}

const getBookWithAuthor = async (id) => {

    if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format')
    }

    const book = await Book.findById(id).populate('author', 'name nationality')

    if (!book) {
        throw new Error('Book not found')
    }

    return book
}

const deleteBook = async (id) => {
    validateObjectId(id)

    const result = await Book.findByIdAndDelete(id)
    if (!result) {
        throw new Error('Book not found')
    }

    return result
}

const updateBook = async (id, updates) => {
    validateObjectId(id)
    validateUpdateBook(updates)

    const book = await Book.findById(id)
    if (!book) {
        throw new Error('Book not found')
    }

    const isChanged =
        book.title !== updates.title ||
        book.genre !== updates.genre ||
        book.price !== updates.price ||
        book.publishedDate.toString() !== new Date(updates.publishedDate).toString() ||
        book.available !== updates.available ||
        book.author.toString() !== updates.author.toString()

    if (!isChanged) {
        return book
    }

    updates.__v = book.__v + 1

    const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true })
    if (!updatedBook) {
        throw new Error('Book not found')
    }

    return updatedBook
}

const replaceBook = async (id, updatedData) => {
    if (!Types.ObjectId.isValid(id)) {
        throw { message: 'Invalid ID format' }
    }

    const existingBook = await Book.findById(id)
    if (!existingBook) {
        throw { message: 'Book not found' }
    }

    const isChanged =
        existingBook.title !== updatedData.title ||
        existingBook.genre !== updatedData.genre ||
        existingBook.price !== updatedData.price ||
        existingBook.publishedDate.toString() !== new Date(updatedData.publishedDate).toString() ||
        existingBook.available !== updatedData.available ||
        existingBook.author.toString() !== updatedData.author.toString()

    if (!isChanged) {
        return existingBook
    }

    updatedData.__v = existingBook.__v + 1

    const replacedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true })
    if (!replacedBook) {
        throw { message: 'Book not found' }
    }

    return replacedBook
}

const getAggregationData = async () => {
    const booksPerGenre = await countBooksPerGenre()
    const avgPricePerGenre = await averagePricePerGenre()

    const mostProlificAuthorData = await authorWithMostBooks()
    console.log('mostProlificAuthorData:', mostProlificAuthorData)

    let mostProlificAuthor = null
    if (mostProlificAuthorData.length > 0) {

        let authorId = mostProlificAuthorData[0]._id
        console.log('authorId:', authorId)

        if (typeof authorId === 'string') {
            console.log('Converting authorId to ObjectId')
            authorId = Types.ObjectId(authorId)
        }

        if (Types.ObjectId.isValid(authorId)) {
            console.log('Valid authorId, querying database...')
            mostProlificAuthor = await Author.findById(authorId).select('name nationality')
            console.log('Found most prolific author:', mostProlificAuthor)
        } else {
            throw new Error('Invalid ID format')
        }
    } else {
        console.log('No author found with most books.')
    }

    return {
        booksPerGenre,
        avgPricePerGenre,
        mostProlificAuthor,
    }
}

const countBooksPerGenre = async () => Book.aggregate([
    { $group: { _id: '$genre', totalBooks: { $sum: 1 } } },
    { $sort: { totalBooks: -1 } }
])

const averagePricePerGenre = async () => Book.aggregate([
    { $group: { _id: '$genre', avgPrice: { $avg: '$price' } } },
    { $sort: { avgPrice: -1 } }
])

const authorWithMostBooks = async () => Book.aggregate([
    { $group: { _id: '$author', totalBooks: { $sum: 1 } } },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 }
])

module.exports = {
    createBook,
    getBooksWithFilters,
    getBookWithAuthor,
    deleteBook,
    updateBook,
    replaceBook,
    getAggregationData,
}

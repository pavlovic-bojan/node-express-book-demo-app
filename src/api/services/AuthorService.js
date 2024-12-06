const Author = require('../models/AuthorSchema')
const { validateObjectId, validateCreateAuthor, validateUpdateAuthor } = require('../validations/Validation')
const createError = require('http-errors')

// Helper function to check for valid ObjectId and fetch the author
const validateAndFetchAuthor = async (id) => {
    validateObjectId(id)

    const author = await Author.findById(id).populate({
        path: 'books',
        select: 'title genre price publishedDate'
    })

    if (!author) {
        throw createError(404, 'Author not found')
    }
    console.log(author.books)
    return author
}

// Function to create a new author
async function createAuthor(data) {
    validateCreateAuthor(data)

    const newAuthor = new Author(data)
    return await newAuthor.save()
}

// Get all authors with pagination, sorting, and filtering
const getAllAuthors = async ({ page = process.env.DEFAULT_PAGE || 1, limit = process.env.DEFAULT_LIMIT || 10, sortBy = 'createdAt', order = 'desc', filters = {} }) => {

    const validOrders = ['asc', 'desc']
    const sortOrder = validOrders.includes(order) ? order : 'desc'

    const query = {}

    // Apply filters (name, nationality, etc.)
    if (filters.name) query.name = { $regex: filters.name, $options: 'i' }
    if (filters.nationality) query.nationality = filters.nationality

    // Paginate and sort
    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
    }

    return await Author.paginate(query, options)
}

// Function to get an author by ID (with books)
async function getAuthorWithBooks(id) {
    return await validateAndFetchAuthor(id) // Reusing the helper function
}

// Function to update an author
async function updateAuthor(id, updates) {
    validateObjectId(id)
    validateUpdateAuthor(updates)

    const author = await Author.findById(id)

    if (!author) {
        throw createError(404, 'Author not found')
    }

    const isChanged =
        author.name !== updates.name ||
        author.age !== updates.age ||
        author.nationality !== updates.nationality ||
        !arraysEqual(author.books || [], updates.books || [])

    if (!isChanged) {
        return author
    }

    updates.__v = author.__v + 1

    const updatedAuthor = await Author.findByIdAndUpdate(id, { $set: updates }, { new: true })

    if (!updatedAuthor) {
        throw createError(404, 'Author not found')
    }

    return updatedAuthor
}

// Function to replace an author
async function replaceAuthor(id, data) {
    validateObjectId(id)
    validateCreateAuthor(data)

    const author = await Author.findById(id)

    if (!author) {
        throw createError(404, 'Author not found')
    }

    const isChanged =
        author.name !== data.name ||
        author.age !== data.age ||
        author.nationality !== data.nationality ||
        !arraysEqual(author.books || [], data.books || [])

    if (isChanged) {
        data.__v = author.__v + 1
    }

    const replacedAuthor = await Author.findByIdAndUpdate(id, data, { new: true })

    if (!replacedAuthor) {
        throw createError(404, 'Author not found')
    }

    return replacedAuthor
}

// Function to delete an author
async function deleteAuthor(id) {
    validateObjectId(id)

    const deletedAuthor = await Author.findByIdAndDelete(id)

    if (!deletedAuthor) {
        throw new Error('Author not found')
    }

    return {
        message: `Author with ID ${id} successfully deleted`,
        deletedAuthor
    }
}

// Search for authors (by name or other fields)
const searchAuthors = async (searchQuery) => {
    if (!searchQuery) {
        return Author.find() // Vrati sve autore ako nema searchQuery
    }
    return Author.find({
        $or: [
            {name: {$regex: searchQuery, $options: 'i'}},
            {nationality: {$regex: searchQuery, $options: 'i'}},
        ],
    })
}

function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (!a.includes(b[i])) return false
    }
    return true
}

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorWithBooks,
    updateAuthor,
    replaceAuthor,
    deleteAuthor,
    searchAuthors,
    validateAndFetchAuthor,
}
const request = require('supertest')
const express = require('express')
const BookService = require('../services/BookService')
const {
    insertBook,
    getAllBooks,
    getBookById,
    deleteBookById,
    updateBook,
    replaceBook,
    getAggregationData
} = require('../controllers/BookController')

// Mock BookService methods
jest.mock('../services/BookService')

const app = express()
app.use(express.json())

// Define routes
app.post('/books', insertBook)
app.get('/books', getAllBooks)
app.get('/books/:id', getBookById)
app.put('/books/:id', updateBook)
app.patch('/books/:id', replaceBook)
app.delete('/books/:id', deleteBookById)
app.get('/books/aggregation', getAggregationData)

describe('BookController', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should insert a new book successfully', async () => {
        const mockBook = { title: 'Book Title', genre: 'Fiction', price: 20, author: 'authorId' }
        const savedBook = { ...mockBook, _id: '12345' }

        // Mock the createBook service
        BookService.createBook.mockResolvedValue(savedBook)

        const response = await request(app)
            .post('/books')
            .send(mockBook)
            .expect(201)

        expect(response.body).toEqual(savedBook)
        expect(BookService.createBook).toHaveBeenCalledWith(mockBook)
    })

    it('should get all books', async () => {
        const mockBooks = [{ title: 'Book Title', genre: 'Fiction', price: 20, author: 'authorId' }]

        // Mock the getBooksWithFilters service
        BookService.getBooksWithFilters.mockResolvedValue(mockBooks)

        const response = await request(app)
            .get('/books')
            .expect(200)

        expect(response.body).toEqual(mockBooks)
        expect(BookService.getBooksWithFilters).toHaveBeenCalled()
    })

    it('should get a book by ID', async () => {
        const mockBook = { title: 'Book Title', genre: 'Fiction', price: 20, author: 'authorId', _id: '12345' }

        // Mock the getBookWithAuthor service
        BookService.getBookWithAuthor.mockResolvedValue(mockBook)

        const response = await request(app)
            .get('/books/12345')
            .expect(200)

        expect(response.body).toEqual(mockBook)
        expect(BookService.getBookWithAuthor).toHaveBeenCalledWith('12345')
    })

    it('should update a book', async () => {
        const updatedBookData = { title: 'Updated Title', genre: 'Updated Genre', price: 25 }
        const updatedBook = { ...updatedBookData, _id: '12345' }

        // Mock the updateBook service
        BookService.updateBook.mockResolvedValue(updatedBook)

        const response = await request(app)
            .put('/books/12345')
            .send(updatedBookData)
            .expect(200)

        expect(response.body).toEqual(updatedBook)
        expect(BookService.updateBook).toHaveBeenCalledWith('12345', updatedBookData)
    })

    it('should replace a book', async () => {
        const replacedBookData = { title: 'Replaced Title', genre: 'Replaced Genre', price: 30 }
        const replacedBook = { ...replacedBookData, _id: '12345' }

        // Mock the replaceBook service
        BookService.replaceBook.mockResolvedValue(replacedBook)

        const response = await request(app)
            .patch('/books/12345')
            .send(replacedBookData)
            .expect(200)

        expect(response.body).toEqual(replacedBook)
        expect(BookService.replaceBook).toHaveBeenCalledWith('12345', replacedBookData)
    })

    it('should delete a book by ID', async () => {
        const deletedBook = { _id: '12345' }

        // Mock the deleteBook service
        BookService.deleteBook.mockResolvedValue(deletedBook)

        const response = await request(app)
            .delete('/books/12345')
            .expect(200)

        expect(response.body.message).toBe('Book deleted successfully')
        expect(BookService.deleteBook).toHaveBeenCalledWith('12345')
    })

})

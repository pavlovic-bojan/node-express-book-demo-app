const request = require('supertest')
const express = require('express')
const { insertAuthor, getAllAuthors, getAuthorById, updateAuthor, replaceAuthor, deleteAuthorById } = require('../controllers/AuthorController')
const AuthorService = require('../services/AuthorService')

// Mock AuthorService methods
jest.mock('../services/AuthorService')

const app = express()
app.use(express.json())

// Define routes
app.post('/authors', insertAuthor)
app.get('/authors', getAllAuthors)
app.get('/authors/:id', getAuthorById)
app.put('/authors/:id', updateAuthor)
app.patch('/authors/:id', replaceAuthor)
app.delete('/authors/:id', deleteAuthorById)

describe('AuthorController', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should insert a new author successfully', async () => {
        const mockAuthor = { name: 'John Doe', age: 40, nationality: 'American' }
        const savedAuthor = { ...mockAuthor, _id: '12345' }

        // Mock the createAuthor service
        AuthorService.createAuthor.mockResolvedValue(savedAuthor)

        const response = await request(app)
            .post('/authors')
            .send(mockAuthor)
            .expect(201)

        expect(response.body).toEqual(savedAuthor)
        expect(AuthorService.createAuthor).toHaveBeenCalledWith(mockAuthor)
    })

    it('should get all authors', async () => {
        const mockAuthors = [{ name: 'John Doe', nationality: 'American' }]

        // Mock the getAllAuthors service
        AuthorService.getAllAuthors.mockResolvedValue(mockAuthors)

        const response = await request(app)
            .get('/authors')
            .expect(200)

        expect(response.body).toEqual(mockAuthors)
        expect(AuthorService.getAllAuthors).toHaveBeenCalled()
    })

    it('should get an author by ID', async () => {
        const mockAuthor = { name: 'John Doe', nationality: 'American', _id: '12345' }

        // Mock the getAuthorWithBooks service
        AuthorService.getAuthorWithBooks.mockResolvedValue(mockAuthor)

        const response = await request(app)
            .get('/authors/12345')
            .expect(200);

        expect(response.body).toEqual(mockAuthor)
        expect(AuthorService.getAuthorWithBooks).toHaveBeenCalledWith('12345')
    })

    it('should return 404 when author not found', async () => {
        // Mock the getAuthorWithBooks service to return null
        AuthorService.getAuthorWithBooks.mockResolvedValue(null)

        const response = await request(app)
            .get('/authors/invalid-id')
            .expect(404);

        expect(response.body.message).toBe(undefined)
    })

    it('should update an author', async () => {
        const updatedAuthorData = { name: 'John Doe Updated', age: 45, nationality: 'American' }
        const updatedAuthor = { ...updatedAuthorData, _id: '12345' }

        // Mock the updateAuthor service
        AuthorService.updateAuthor.mockResolvedValue(updatedAuthor)

        const response = await request(app)
            .put('/authors/12345')
            .send(updatedAuthorData)
            .expect(200);

        expect(response.body).toEqual(updatedAuthor);
        expect(AuthorService.updateAuthor).toHaveBeenCalledWith('12345', updatedAuthorData)
    })

    it('should replace an author', async () => {
        const replacedAuthorData = { name: 'Jane Doe', age: 50, nationality: 'British' }
        const replacedAuthor = { ...replacedAuthorData, _id: '12345' };

        // Mock the replaceAuthor service
        AuthorService.replaceAuthor.mockResolvedValue(replacedAuthor)

        const response = await request(app)
            .patch('/authors/12345')
            .send(replacedAuthorData)
            .expect(200)

        expect(response.body).toEqual(replacedAuthor)
        expect(AuthorService.replaceAuthor).toHaveBeenCalledWith('12345', replacedAuthorData)
    })

    it('should delete an author by ID', async () => {
        const deletedAuthor = { _id: '12345' }

        // Mock the deleteAuthor service
        AuthorService.deleteAuthor.mockResolvedValue(deletedAuthor)

        const response = await request(app)
            .delete('/authors/12345')
            .expect(200)

        expect(response.body.message).toBe('Author deleted successfully')
        expect(AuthorService.deleteAuthor).toHaveBeenCalledWith('12345')
    })

    it('should return 404 when deleting non-existent author', async () => {
        // Mock the deleteAuthor service to return null
        AuthorService.deleteAuthor.mockResolvedValue(null)

        const response = await request(app)
            .delete('/authors/invalid-id')
            .expect(404);

        expect(response.body.message).toBe(undefined)
    })
})

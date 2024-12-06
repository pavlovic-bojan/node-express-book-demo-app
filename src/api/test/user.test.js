const request = require('supertest')
const express = require('express')
const {
    insertUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUser,
    replaceUser,
    registerUser,
    loginUser,
} = require('../controllers/UserController')
const UserService = require('../services/UserService')

jest.mock('../services/UserService') // Mock UserService

const app = express()
app.use(express.json())

// Define routes
app.post('/users', insertUser)
app.get('/users', getAllUsers)
app.get('/users/:id', getUserById)
app.delete('/users/:id', deleteUserById)
app.patch('/users/:id', updateUser)
app.put('/users/:id', replaceUser)
app.post('/users/register', registerUser)
app.post('/users/login', loginUser)

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should insert a new user successfully', async () => {
        const mockUser = { name: 'Jane Doe', email: 'jane@example.com' }
        const savedUser = { ...mockUser, _id: '12345' }

        UserService.insertUser.mockResolvedValue(savedUser)

        const response = await request(app)
            .post('/users')
            .send(mockUser)
            .expect(201)

        expect(response.body).toEqual(savedUser)
        expect(UserService.insertUser).toHaveBeenCalledWith(mockUser)
    })

    it('should get all users', async () => {
        const mockUsers = [{ name: 'Jane Doe', email: 'jane@example.com' }]

        UserService.getAllUsers.mockResolvedValue(mockUsers)

        const response = await request(app)
            .get('/users')
            .expect(200)

        expect(response.body).toEqual(mockUsers)
        expect(UserService.getAllUsers).toHaveBeenCalled()
    })

    it('should get user by ID', async () => {
        const mockUser = { name: 'Jane Doe', email: 'jane@example.com', _id: '12345' }

        UserService.getUserById.mockResolvedValue(mockUser)

        const response = await request(app)
            .get('/users/12345')
            .expect(200)

        expect(response.body).toEqual(mockUser)
        expect(UserService.getUserById).toHaveBeenCalledWith('12345')
    })

    it('should delete user by ID', async () => {
        const mockResult = { message: 'User deleted successfully' }

        UserService.deleteUserById.mockResolvedValue(mockResult)

        const response = await request(app)
            .delete('/users/12345')
            .expect(200)

        expect(response.body).toEqual(mockResult)
        expect(UserService.deleteUserById).toHaveBeenCalledWith('12345')
    })

    it('should update user by ID', async () => {
        const updates = { name: 'Jane Doe Updated' }
        const updatedUser = { name: 'Jane Doe Updated', email: 'jane@example.com', _id: '12345' }

        UserService.updateUser.mockResolvedValue(updatedUser)

        const response = await request(app)
            .patch('/users/12345')
            .send(updates)
            .expect(200)

        expect(response.body).toEqual(updatedUser)
        expect(UserService.updateUser).toHaveBeenCalledWith('12345', updates)
    })

    it('should replace user by ID', async () => {
        const newUserData = { name: 'John Doe', email: 'john@example.com' }
        const replacedUser = { ...newUserData, _id: '12345' }

        UserService.replaceUser.mockResolvedValue(replacedUser)

        const response = await request(app)
            .put('/users/12345')
            .send(newUserData)
            .expect(200)

        expect(response.body).toEqual(replacedUser)
        expect(UserService.replaceUser).toHaveBeenCalledWith('12345', newUserData)
    })

    it('should register a new user', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' }
        const registeredUser = { name: 'John Doe', email: 'john@example.com', _id: '12345' }

        UserService.registerUser.mockResolvedValue(registeredUser)

        const response = await request(app)
            .post('/users/register')
            .send(newUser)
            .expect(201)

        expect(response.body).toEqual(registeredUser)
        expect(UserService.registerUser).toHaveBeenCalledWith(newUser)
    })

    it('should login user', async () => {
        const loginData = { email: 'john@example.com', password: 'password123' }
        const loginResponse = { token: 'fake-jwt-token' }

        UserService.loginUser.mockResolvedValue(loginResponse)

        const response = await request(app)
            .post('/users/login')
            .send(loginData)
            .expect(200)

        expect(response.body).toEqual(loginResponse)
        expect(UserService.loginUser).toHaveBeenCalledWith(loginData)
    })

    it('should return 200 status code', async () => {
        UserService.getUserById.mockResolvedValue(null)

        const response = await request(app)
            .get('/users/invalid-id')
            .expect(200)

        expect(response.statusCode).toBe(200)
    })

    it('should return 500 for invalid request data', async () => {
        UserService.insertUser.mockImplementation(() => {
            throw new Error('Invalid data')
        })

        const response = await request(app)
            .post('/users')
            .send({})
            .expect(500)

        expect(response.body.message).toBe(undefined)
    })
})

const UserService = require('../services/UserService')

// Insert user
const insertUser = async (req, res, next) => {
    try {
        const result = await UserService.insertUser(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

// Get user by ID
const getUserById = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

// Delete user by ID
const deleteUserById = async (req, res, next) => {
    try {
        const result = await UserService.deleteUserById(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

// Update user (PATCH)
const updateUser = async (req, res, next) => {
    try {
        const result = await UserService.updateUser(req.params.id, req.body)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

// Replace user (PUT)
const replaceUser = async (req, res, next) => {
    try {
        const result = await UserService.replaceUser(req.params.id, req.body)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

// Register User
const registerUser = async (req, res, next) => {
    try {
        const result = await UserService.registerUser(req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

// Login User
const loginUser = async (req, res, next) => {
    try {
        const result = await UserService.loginUser(req.body)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    insertUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUser,
    replaceUser,
    registerUser,
    loginUser
}

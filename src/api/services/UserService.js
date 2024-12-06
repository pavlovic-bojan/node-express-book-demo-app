const User = require('../models/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const createError = require('http-errors')


// Insert user
const insertUser = async (userData) => {
    const { user_name, email, age, created_at, role, password } = userData

    if (!user_name || !email || !age || !password) {
        throw createError(400, 'Missing required fields')
    }

    const user = new User({
        user_name,
        email,
        age,
        role,
        password,
        created_at: created_at ? new Date(created_at) : new Date()
    })

    await user.save()
    return { message: 'User inserted successfully' }
}

// Get all users
const getAllUsers = async () => {
    return await User.find() // Mongoose find method to get all users
}

// Get user by ID
const getUserById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid ID format') // Use Mongoose's isValidObjectId method

    const user = await User.findById(id) // Mongoose findById method
    if (!user) throw createError(404, 'User not found')

    return user
}

// Delete user by ID
const deleteUserById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid ID format') // Use Mongoose's isValidObjectId method

    const result = await User.findByIdAndDelete(id) // Mongoose findByIdAndDelete method
    if (!result) throw createError(404, 'User not found')

    return { message: 'User deleted successfully' }
}

// Update user (PATCH)
const updateUser = async (id, updates) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid ID format') // Use Mongoose's isValidObjectId method

    const result = await User.findByIdAndUpdate(id, updates, { new: true }) // Mongoose findByIdAndUpdate method
    if (!result) throw createError(404, 'User not found')

    return { message: 'User updated successfully' }
}

// Replace user (PUT)
const replaceUser = async (id, updatedUser) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid ID format')

    const result = await User.findByIdAndUpdate(id, updatedUser, { new: true })
    if (!result) throw createError(404, 'User not found')

    return { message: 'User replaced successfully' }
}

// Register User
const registerUser = async (userData) => {
    const { user_name, email, age, password, role } = userData

    if (!['client', 'admin'].includes(role)) throw createError(400, 'Invalid role. Must be client or admin')

    const existingUser = await User.findOne({ user_name })
    if (existingUser) throw createError(401, 'User already exists')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        user_name,
        email,
        age,
        hashedPassword,
        role
    })

    await newUser.save() // Save new user
    return { message: 'User registered successfully' }
}

// Login User
const loginUser = async (loginData) => {
    const { user_name, password } = loginData

    if (!user_name || !password) throw new Error('Missing required fields')

    const user = await User.findOne({ user_name })
    if (!user) throw new Error('User not found')

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)
    if (!passwordMatch) throw new Error('Invalid credentials')

    const token = jwt.sign({ username: user.user_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return { token }
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

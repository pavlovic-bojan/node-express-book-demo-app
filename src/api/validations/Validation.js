const { Types } = require('mongoose')

function validateObjectId(id) {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format')
    }
}

function validateAuthorName(name) {
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        throw new Error('Author name must be a string with at least 3 characters')
    }
}

function validateAuthorAge(age) {
    if (age && (typeof age !== 'number' || age < 18)) {
        throw new Error('Author age must be a number and at least 18 years old')
    }
}

function validateBookData(data) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 1) {
        throw new Error('Book title is required and must be a valid string')
    }
    if (!data.genre || typeof data.genre !== 'string' || data.genre.trim().length < 1) {
        throw new Error('Book genre is required and must be a valid string')
    }
    if (isNaN(data.price) || data.price <= 0) {
        throw new Error('Book price must be a positive number')
    }
}

function validateUserData(data) {
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        throw new Error('Valid email address is required')
    }
    if (!data.password || data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
    }
}

function validateUniqueEmail(email) {
    // Ovdje bi trebalo da proverite u bazi da li već postoji korisnik sa istim emailom
    // Pretpostavljamo da imate metodu za to, npr. User.findOne({ email })
    // Ako postoji, bacite grešku
    // throw new Error('Email is already registered');
}

function validateCreateAuthor(data) {
    if (!data || !data.name || !data.age || !data.nationality) {
        throw new Error('Missing required fields: name, age, nationality')
    }

    if (typeof data.name !== 'string' || data.name.trim() === '') {
        throw new Error('Invalid name format')
    }
    if (typeof data.age !== 'number' || data.age < 0) {
        throw new Error('Invalid age format')
    }
    if (typeof data.nationality !== 'string' || data.nationality.trim() === '') {
        throw new Error('Invalid nationality format')
    }
}

function validateUpdateAuthor(data) {
    if (data.name) {
        validateAuthorName(data.name)
    }
    if (data.age) {
        validateAuthorAge(data.age)
    }
}

function validateCreateBook(data) {
    validateBookData(data)
}

function validateAndProcessId(id) {
    validateObjectId(id)
}

const validateUpdateBook = (updates) => {
    if (!updates || typeof updates !== 'object') {
        throw new Error('Invalid update payload')
    }
    if (updates.title && typeof updates.title !== 'string') {
        throw new Error('Title must be a string')
    }
    if (updates.genre && typeof updates.genre !== 'string') {
        throw new Error('Genre must be a string')
    }
    if (updates.price && (typeof updates.price !== 'number' || updates.price < 0)) {
        throw new Error('Price must be a non-negative number')
    }
    if (updates.publishedDate && isNaN(new Date(updates.publishedDate).getTime())) {
        throw new Error('Invalid published date')
    }
    if (updates.available !== undefined && typeof updates.available !== 'boolean') {
        throw new Error('Available must be a boolean')
    }
}

module.exports = {
    validateObjectId,
    validateAuthorName,
    validateAuthorAge,
    validateBookData,
    validateUserData,
    validateUniqueEmail,
    validateCreateAuthor,
    validateUpdateAuthor,
    validateCreateBook,
    validateAndProcessId,
    validateUpdateBook
}

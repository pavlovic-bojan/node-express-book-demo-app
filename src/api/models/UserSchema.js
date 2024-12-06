const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose

const userSchema = new Schema({
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    role: { type: String, enum: ['client', 'admin'], required: true },
    created_at: { type: Date, default: Date.now },
    hashedPassword: { type: String},
    password: { type: String, select: false },
},{
    timestamps: true,
    versionKey: '__v'
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = undefined
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

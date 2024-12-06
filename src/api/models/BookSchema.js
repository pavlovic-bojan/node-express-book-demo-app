const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 3, trim: true },
    genre: { type: String, required: true, minlength: 3, trim: true },
    price: { type: Number, required: true, min: 0 },
    publishedDate: {type: Date, required: true} ,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    available: {type: Boolean, default: true}
},{
    timestamps: true,
    versionKey: '__v'
})

bookSchema.plugin(mongoosePaginate)
const Book = mongoose.model('Book', bookSchema)
module.exports = Book
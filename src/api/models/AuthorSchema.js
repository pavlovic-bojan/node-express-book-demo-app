const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3},
    age: { type: Number, min: 0, default: 0,  },
    nationality: { type: String},
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
},{
    timestamps: true,
    versionKey: '__v'
})

authorSchema.plugin(mongoosePaginate)
const Author = mongoose.model('Author', authorSchema)
module.exports = Author
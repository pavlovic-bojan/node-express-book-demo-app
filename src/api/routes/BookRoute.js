const express = require('express')
const {insertBook, getAllBooks, getBookById, deleteBookById, updateBook, replaceBook, getAggregationData} = require('../controllers/bookController')
const router = express.Router()

/**
 * @swagger
 * /books/aggregation:
 *   get:
 *     tags:
 *       - Books
 *     description: Get aggregated data about books, including count per genre, average price per genre, and the most prolific author
 *     responses:
 *       200:
 *         description: Aggregated data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booksPerGenre:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genre:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 avgPricePerGenre:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       genre:
 *                         type: string
 *                       averagePrice:
 *                         type: number
 *                         format: float
 *                 mostProlificAuthor:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     nationality:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
router.get('/aggregation', getAggregationData)

/**
 * @swagger
 * /books:
 *   post:
 *     tags:
 *       - Books
 *     description: Create a new book
 *     parameters:
 *       - in: body
 *         name: bookData
 *         description: Data for the new book
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - author
 *             - genre
 *             - publicationYear
 *           properties:
 *             title:
 *               type: string
 *               description: The title of the book
 *             author:
 *               type: string
 *               description: The ID of the author who wrote the book
 *             genre:
 *               type: string
 *               description: Genre of the book
 *             publicationYear:
 *               type: integer
 *               description: The year the book was published
 *             pages:
 *               type: integer
 *               description: The number of pages in the book
 *             ISBN:
 *               type: string
 *               description: ISBN number of the book
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: The date and time the book was created
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: The date and time the book was last updated
 *     responses:
 *       200:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 publicationYear:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 ISBN:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Author not found
 *       409:
 *         description: Book already exists
 *       500:
 *         description: Internal server error
 */
router.post('', insertBook)

/**
 * @swagger
 * /books:
 *   get:
 *     tags:
 *       - Books
 *     description: Get a list of books with filtering and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: The number of books per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *       - in: query
 *         name: genre
 *         description: Filter books by genre
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         description: Filter books with price greater than or equal to the specified value
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: maxPrice
 *         description: Filter books with price less than or equal to the specified value
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: available
 *         description: Filter books based on availability (true/false)
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - true
 *             - false
 *       - in: query
 *         name: sortBy
 *         description: The field to sort books by
 *         required: false
 *         schema:
 *           type: string
 *           default: title
 *           enum:
 *             - title
 *             - author
 *             - price
 *             - publicationYear
 *       - in: query
 *         name: sortOrder
 *         description: The order to sort books in (asc/desc)
 *         required: false
 *         schema:
 *           type: string
 *           default: asc
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: A list of books matching the filters and sorting criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: The current page of results
 *                 limit:
 *                   type: integer
 *                   description: The number of results per page
 *                 total:
 *                   type: integer
 *                   description: Total number of books matching the filters
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       price:
 *                         type: number
 *                         format: float
 *                       genre:
 *                         type: string
 *                       available:
 *                         type: boolean
 *                       publicationYear:
 *                         type: integer
 *                       ISBN:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('', getAllBooks)

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags:
 *       - Books
 *     description: Get a book by ID with author details
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the book to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book along with the author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     nationality:
 *                       type: string
 *                 genre:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 available:
 *                   type: boolean
 *                 publicationYear:
 *                   type: integer
 *                 ISBN:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getBookById)

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags:
 *       - Books
 *     description: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the book to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 available:
 *                   type: boolean
 *                 publicationYear:
 *                   type: integer
 *                 ISBN:
 *                   type: string
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteBookById)

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     tags:
 *       - Books
 *     description: Update details of a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the book to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: book
 *         description: The updated details of the book
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             genre:
 *               type: string
 *             price:
 *               type: number
 *               format: float
 *             publishedDate:
 *               type: string
 *               format: date-time
 *             available:
 *               type: boolean
 *             author:
 *               type: string
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 publishedDate:
 *                   type: string
 *                   format: date-time
 *                 available:
 *                   type: boolean
 *                 author:
 *                   type: string
 *       400:
 *         description: Invalid book ID or invalid book data
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateBook)

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags:
 *       - Books
 *     description: Replace an existing book by ID with new data
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the book to replace
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: book
 *         description: The new data to replace the existing book
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             genre:
 *               type: string
 *             price:
 *               type: number
 *               format: float
 *             publishedDate:
 *               type: string
 *               format: date-time
 *             available:
 *               type: boolean
 *             author:
 *               type: string
 *     responses:
 *       200:
 *         description: The book was successfully replaced
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 genre:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 publishedDate:
 *                   type: string
 *                   format: date-time
 *                 available:
 *                   type: boolean
 *                 author:
 *                   type: string
 *       400:
 *         description: Invalid book ID or invalid book data
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', replaceBook)

module.exports = router

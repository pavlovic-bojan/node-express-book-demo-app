const express = require('express')
const { insertAuthor, getAllAuthors, getAuthorById, updateAuthor, replaceAuthor, deleteAuthorById} = require('../controllers/AuthorController')
const router = express.Router()

/**
 * @swagger
 * /authors:
 *   post:
 *     tags:
 *       - Authors
 *     description: Create a new author
 *     operationId: createAuthor
 *     parameters:
 *       - in: body
 *         name: author
 *         description: The author data to be created
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - bio
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the author
 *             email:
 *               type: string
 *               description: The author's email address
 *             bio:
 *               type: string
 *               description: A brief biography of the author
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.post('', insertAuthor)

/**
 * @swagger
 * /authors:
 *   get:
 *     tags:
 *       - Authors
 *     description: Get all authors with pagination, sorting, and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination (default is 1)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of authors per page (default is 10)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         description: Field by which to sort (default is 'createdAt')
 *         required: false
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         description: Sorting order, either 'asc' or 'desc' (default is 'desc')
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: filters[name]
 *         description: Filter authors by name (case insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: filters[nationality]
 *         description: Filter authors by nationality
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of authors with pagination, sorting, and filtering applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       nationality:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('', getAllAuthors)

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     tags:
 *       - Authors
 *     description: Get an author by ID, including their books
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the author
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author found successfully, along with their books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 nationality:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       genre:
 *                         type: string
 *                       publishedYear:
 *                         type: integer
 *                       authorId:
 *                         type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Author not found
 *       400:
 *         description: Invalid ID format
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getAuthorById)

/**
 * @swagger
 * /authors/{id}:
 *   patch:
 *     tags:
 *       - Authors
 *     description: Update an author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the author to be updated
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: author
 *         description: Updated author data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             nationality:
 *               type: string
 *             books:
 *               type: array
 *               items:
 *                 type: string
 *             __v:
 *               type: integer
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 nationality:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       400:
 *         description: Invalid ID format or invalid input data
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', updateAuthor)

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     tags:
 *       - Authors
 *     description: Replace an author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the author to be replaced
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: author
 *         description: New author data to replace the existing author
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             nationality:
 *               type: string
 *             books:
 *               type: array
 *               items:
 *                 type: string
 *             __v:
 *               type: integer
 *     responses:
 *       200:
 *         description: Author replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 nationality:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       400:
 *         description: Invalid ID format or invalid input data
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', replaceAuthor)

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     tags:
 *       - Authors
 *     description: Delete an author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the author to be deleted
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedAuthor:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     nationality:
 *                       type: string
 *                     books:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteAuthorById)

module.exports = router
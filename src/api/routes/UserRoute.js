const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authenticateAndAuthorize = require('../middleware/AuthenticateAndAuthorize')

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Insert a new user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User data for registration
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - user_name
 *             - email
 *             - age
 *             - password
 *             - role
 *           properties:
 *             user_name:
 *               type: string
 *             email:
 *               type: string
 *             age:
 *               type: integer
 *             password:
 *               type: string
 *               format: password
 *             role:
 *               type: string
 *               enum:
 *                 - client
 *                 - admin
 *             created_at:
 *               type: string
 *               format: date-time
 *     responses:
 *       200:
 *         description: User inserted successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('', authenticateAndAuthorize(['admin']), UserController.insertUser)

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users - This is an Admin only endpoint
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   role:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid request
 */
router.get('', authenticateAndAuthorize(['admin']), UserController.getAllUsers)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Get a user by id - This is an Admin & Client role endpoint
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The user ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 role:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateAndAuthorize(['admin', 'client']), UserController.getUserById)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Delete a user by ID - Admin role only
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The user ID to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateAndAuthorize(['admin']), UserController.deleteUserById)

/**
 * @swagger
 * /users/:id:
 *   patch:
 *     tags:
 *       - Users
 *     description: Update a user - This is an Admin & Client role endpoint
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Update a user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - user_name
 *             - email
 *             - age
 *             - password
 *             - role
 *           properties:
 *             user_name:
 *               type: string
 *             email:
 *               type: string
 *             age:
 *               type: integer
 *             password:
 *               type: string
 *             role:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 */
router.patch('/:id', authenticateAndAuthorize(['admin', 'client']), UserController.updateUser)

/**
 * @swagger
 * /users/:id:
 *   put:
 *     tags:
 *       - Users
 *     description: Replaced a user - This is an Admin only endpoint
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Replaced a user
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - user_name
 *             - email
 *             - age
 *             - password
 *             - role
 *           properties:
 *             user_name:
 *               type: string
 *             email:
 *               type: string
 *             age:
 *               type: integer
 *             password:
 *               type: string
 *             role:
 *               type: string
 *     responses:
 *       200:
 *         description: User replaced successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticateAndAuthorize(['admin']), UserController.replaceUser)

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     description: Register as a user - This is an Admin only endpoint
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User Register Data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - user_name
 *             - email
 *             - age
 *             - password
 *             - role
 *           properties:
 *             user_name:
 *               type: string
 *             email:
 *               type: string
 *             age:
 *               type: integer
 *             password:
 *               type: string
 *             role:
 *               type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid role. Must be client or admin
 *       401:
 *         description: User already exists
 */
router.post('/register', authenticateAndAuthorize(['admin']), UserController.registerUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     description: Login as a user - This is a Public endpoint
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User login credentials
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', UserController.loginUser)

module.exports = router
